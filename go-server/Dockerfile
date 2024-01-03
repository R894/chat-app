FROM golang
WORKDIR /go/src/app
COPY . .
RUN go get -d -v ./...
RUN go install -v ./...
RUN go build ./cmd/main.go
EXPOSE 5000
CMD ["./main"]