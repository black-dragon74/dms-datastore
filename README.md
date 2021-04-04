# DMS Data Store API

DMS data store API is an abstraction of features that are not a part of DMS server. Currently, it handles data for mess
menu and faculty contacts.

This API is written in TypeScript for the ease of development over time.

# How to run

DMS REST API requires [NodeJS] and [Express] to run.

To install the dependencies and start the server, run:

```sh
$ cd dms-datastore
$ yarn install # npm install
$ yarn run serve # npm run serve
```

# Usage

The API supports the following routes:

### Mess Menu:

Type: `GET` - URL: `/mess` - Return type:

```swift
struct MessMenu {
    let last_updated_at: String?,
    let last_updated_meal: String?,
    let breakfast: [String]?,
    let lunch: [String]?,
    let high_tea: [String]?,
    let dinner: [String]?
}
```

### Faculty Contacts:

Type: `GET` - URL: `/contacts` - Return type:

```swift
struct FacultyContacts {
    let id: Int
    let name: String
    let designation: String
    let department: String
    let email: String
    let phone: String
    let image: String
}
```

# Tech

This API uses a number of open source projects to work properly:

* [NodeJS] - JavaScript runtime built on Chrome's V8 JavaScript engine
* [Express] - Fast, unopinionated, minimalist web framework for Node.js

# Contributing

Would like to help? You are more than welcome to do so. Just make sure that the pull request you submit **meets the
following requirements**:

- Code should be well documented in the TypeScript doc format
- Code should be properly formatted
- Relevant variable names should be used

Failure to comply to above will lead in your PR being trashed.

# Contributors

This API would never have been possible without the support of:

- [black-dragon74](https://github.com/black-dragon74) - For writing this software and maintaining it.
- [MUJ HUB](https://mujhub.com) - This API reads mess menu data from their stores.

***Another hobby project by Nick ;=)***

<!-- LINKS USED IN THIS MARKDOWN FILE -->

[NodeJS]: <https://nodejs.org/>

[Express]: <https://expressjs.com>
