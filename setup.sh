#!/bin/bash
set -e -o pipefail

help() {
    echo
    echo 'Usage ./setup.sh'
    echo
    echo 'Checks that your Triton environment is sane and configures'
    echo 'an environment file to use.'
    echo
}

# Check for correct configuration
check() {
    command -v triton >/dev/null 2>&1 || {
        echo
        tput rev  # reverse
        tput bold # bold
        echo 'Error! Joyent Triton CLI is required, but does not appear to be installed.'
        tput sgr0 # clear
        echo 'See https://www.joyent.com/blog/introducing-the-triton-command-line-tool'
        exit 1
    }

    TRITON_DC=$(triton profile get | awk -F"/" '/url:/{print $3}' | awk -F'.' '{print $1}')
    TRITON_ACCOUNT=$(triton account get | awk -F": " '/id:/{print $2}')

    rm -f _env_consul
    rm -f _env
    if [ -e .env ];
    then
        rm -f .env
    fi

    echo '# Consul discovery via Triton CNS' >> _env_consul
    echo CONSUL=webconsole-console-consul.svc.${TRITON_ACCOUNT}.${TRITON_DC}.joyent.com >> _env_consul
    echo CONSUL_AGENT=1 >> _env_consul
    echo >> _env_consul

    echo '# Site URL' >> _env
    echo BASE_URL=https://webconsole-console.svc.${TRITON_ACCOUNT}.${TRITON_DC}.triton.zone >> _env
    echo >> _env
    echo PORT=8080 >> _env
    echo NODE_ENV=production >> _env
    echo HEALTH_ENDPOINT=check-it-out >> _env
    echo >> _env
    echo '# Navigation config' >> _env
    echo NAV_CATEGORIES='[{ "name": "test", "products": [{ "name": "test", "path": "/test" }] }]' >> _env
    echo NAV_DATACENTERS='[{ "name": "us-sw-1", "url": "https://us-sw-1.api.joyentcloud.com" }]' >> _env
    echo >> _env
}

# ---------------------------------------------------
# parse arguments

# Get function list
funcs=($(declare -F -p | cut -d " " -f 3))

until
    if [ ! -z "$1" ]; then
        # check if the first arg is a function in this file, or use a default
        if [[ " ${funcs[@]} " =~ " $1 " ]]; then
            cmd=$1
            shift 1
        else
            cmd="check"
        fi

        $cmd "$@"
        if [ $? == 127 ]; then
            help
        fi

        exit
    else
        check
    fi
do
    echo
done
