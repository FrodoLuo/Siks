# Siks

This repository is for the MINI project in tencent PCG training.

As for the name, it comes from `six` and `seek`, basing on the theory that **any two person in the world can be connected within less than 6 joint**. So we've come up with an idea to help people who is strugling to find someone once met in a sudden eyecatch.

**And this repo is only the front end part of the whole application system.**

## Table of Content

-   Techniques
-   Install & Set up

---

## Techniques

-   WeApp
-   Nodejs > 8
-   Taro
-   TypeScript
-   Mobx
-   Less

## Install & Setup

### Install Nodejs

For both Windows and OSX, we recommand to install `nvm`, and install node through `nvm`.

Through `nvm`, we can easily install manage node versions.

#### For Windows

In Powershell(recommand)
```Powershell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
```

#### For Mac & Linux

In Terminal/Bash
```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
```

#### Or

Just read the official document [here](https://github.com/nvm-sh/nvm#install--update-script)

### Install Yarn (Optional)

```sh
npm install -g yarn
```

### Install Dependencies

In the project root

```sh
yarn install
# or 
npm install
```

### Set up dev environment

```sh
yarn global add @tarojs/cli
yarn global add tslint
#or
npm install -g @tarojs/cli
npm install -g tslint
```

### Launch

Download and install `WeApp Developer Tool`.

https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

To start WeApp compiling
```sh
yarn dev:weapp
#
npm run dev:weapp
```

And then you need load this project in `WeApp Developer Tool`.