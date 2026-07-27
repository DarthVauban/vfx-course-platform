#!/usr/bin/env bash
set -Eeuo pipefail

if [[ $# -ne 1 || ! "$1" =~ ^[0-9a-f]{40}$ ]]; then
  echo "Usage: deploy.sh <40-character-git-sha>" >&2
  exit 64
fi

readonly new_tag="$1"
readonly deploy_dir="/opt/vfx-course-platform"
readonly env_file="${deploy_dir}/.env"
readonly compose_file="${deploy_dir}/compose.production.yml"
readonly project_name="vfx-course-platform"

cd "${deploy_dir}"

exec 9>"${deploy_dir}/.deploy.lock"
if ! flock -n 9; then
  echo "Another deployment is already running." >&2
  exit 75
fi

previous_tag=""
if [[ -f "${env_file}" ]]; then
  previous_tag="$(sed -n 's/^IMAGE_TAG=//p' "${env_file}" | head -n 1)"
fi

write_env() {
  local tag="$1"
  printf 'IMAGE_TAG=%s\n' "${tag}" > "${env_file}.tmp"
  mv "${env_file}.tmp" "${env_file}"
}

compose() {
  docker compose \
    --project-name "${project_name}" \
    --env-file "${env_file}" \
    --file "${compose_file}" \
    "$@"
}

wait_until_healthy() {
  local container_id state

  container_id="$(compose ps -q web)"
  if [[ -z "${container_id}" ]]; then
    echo "The web container was not created." >&2
    return 1
  fi

  for _ in $(seq 1 30); do
    state="$(
      docker inspect \
        --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' \
        "${container_id}"
    )"

    case "${state}" in
      healthy)
        return 0
        ;;
      unhealthy | exited | dead)
        echo "Container entered state: ${state}" >&2
        return 1
        ;;
    esac

    sleep 2
  done

  echo "Timed out waiting for the web container healthcheck." >&2
  return 1
}

rollback() {
  echo "Deployment failed; rolling back vfx-course-platform only." >&2

  if [[ "${previous_tag}" =~ ^[0-9a-f]{40}$ ]]; then
    write_env "${previous_tag}"
    compose up --detach --remove-orphans
  else
    compose down --remove-orphans
    rm -f "${env_file}"
  fi
}

write_env "${new_tag}"

if ! compose pull web; then
  rollback
  exit 1
fi

if ! compose up --detach --remove-orphans; then
  rollback
  exit 1
fi

if ! wait_until_healthy; then
  rollback
  exit 1
fi

echo "Deployment ${new_tag} is healthy."

