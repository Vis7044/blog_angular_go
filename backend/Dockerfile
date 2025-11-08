# build stage
FROM golang:1.25-alpine AS build

WORKDIR /app

# Download dependencies
COPY go.mod go.sum ./
RUN go mod download

# copy all source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server .

# production stage
FROM alpine:latest

# create a non-root user
RUN adduser -D myuser

WORKDIR /app

# copy the built binary from the build stage
COPY --from=build /app/server .

# switch to non-root user
USER myuser

EXPOSE 8080

ENTRYPOINT [ "./server" ]