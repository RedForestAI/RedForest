# SandCastle Reader

![license](https://img.shields.io/github/license/oele-isis-vanderbilt/SandCastleReader)

Scientific Web Application for exploring eye-tracking behavior in reading

## Features

* Automatic Areas-of-Interest (AOI) tracking (via [AOIWebTracker](https://github.com/oele-isis-vanderbilt/AOIWebTracker))
* PDF integration
* Side-by-side quiz taking along content
* Creation of modules, with multiple readings, to compose a curriculum

## Installation

To install all the necessary dependencies, use the following command:

```bash
npm install
```

## Development

To run and develop the application, its recommended to use the following to start a development server:

```bash
npm run serve
```

## Usage

To run the SandCastle Reader application, you need to run the back-end application first, located in this [GitHub repo](https://github.com/oele-isis-vanderbilt/SandCastleReader-Server). Once the back-end server is running, you can start the VueJS client-side component with the following command:

```bash
npm run build
```
