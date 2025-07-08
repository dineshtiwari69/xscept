
![Logo](./public/logo.png) 
# 🛡️ xscept — 0x Friction HTTP Interceptor

xscept is a zero-friction HTTP interceptor that makes it effortless to capture network traffic. Whether you're launching Chrome, Firefox, or even an Android app — xscept lets you inspect requests with a single click.


## ⚙️ Preview

![Preview](https://s7.ezgif.com/tmp/ezgif-7fa4f33f29a335.gif)


## ❓ FAQ

#### Why xscept ?

Because setting up Burp Suite, configuring proxies, installing certificates, and bypassing SSL pinning every single time just to inspect traffic is annoying. I wanted a "click and see logs" kind of tool — so I built it.

#### HTTPToolKit does that too right ?

Yep, and I love HTTP Toolkit. It’s well made. But personally, I just needed something simple that lets me copy cURL commands without paying for a subscription. This project is more of a personal challenge — to build a tool I actually use at work.

If you're using HTTP Toolkit daily — go support them. They deserve it.


## Features

- ⚡ Instant Chrome/Firefox profile launch
- 🕵️ Intercepts all trafficg 
- 🪶 Lightweight by design
- 📋 One-click “Copy as cURL”

## 🧪 Run Locally 

Clone the project

```bash
  git clone https://github.com/dineshtiwari69/xscept-0x
```

Go to the project directory

```bash
  cd xscept-0x
```

Install dependencies

```bash
  pnpm install
```
Install Server Reqs

```bash
  pnpm run install-reqs
```
Build Server Sidecar

```bash
  pnpm run build:sidecar-winos
```
Run App
```bash
  pnpm run tauri dev
```

