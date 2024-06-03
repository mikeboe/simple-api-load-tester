# ...

update-pkg-cache:
    GOPROXY=https://proxy.golang.org GO111MODULE=on \
    go get github.com/mikeboe/simple-api-load-tester@0.1.2

# ...