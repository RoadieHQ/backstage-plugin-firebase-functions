# Firebase Functions Plugin for Backstage

![details in the Firebase Functions plugin for Backstage](https://raw.githubusercontent.com/RoadieHQ/backstage-plugin-firebase-functions/master/docs/firebase-function-details.png)

[https://roadie.io/backstage/plugins/firebase-functions](https://roadie.io/backstage/plugins/firebase-functions)

## Repository migration notice

In order to make testing and deployment of our plugins easier we are migrating all Roadie plugins to a monorepo at https://github.com/RoadieHQ/roadie-backstage-plugins.
The plugins will still be published to the same place on NPM and will have the same package names so nothing should change for consumers of these plugins.

## Features

- Display firebase functions details
- link to overview or logs in the cloud google platform console

## How to add firebase-functions project dependency to Backstage app

If you have your own Backstage application without this plugin, here's how to add it:

1. In the [packages/app](https://github.com/backstage/backstage/blob/master/packages/app/) directory of your backstage instance, add the plugin as a package.json dependency:

```bash
yarn add @roadiehq/backstage-plugin-firebase-functions
```

2. import the plugin to the [entityPage.tsx](https://github.com/backstage/backstage/blob/master/packages/app/src/components/catalog/EntityPage.tsx) source file:

```tsx
import {
  EntityFirebaseFunctionsContent
} from '@roadiehq/backstage-plugin-firebase-functions';

...

const serviceEntityPage = (
<EntityLayoutWrapper>
  ...
    <EntityLayout.Route 
      path="/firebase-functions"
      title="Firebase Functions">
      <EntityFirebaseFunctionsContent />
    </EntityLayout.Route>
  ...
</EntityLayoutWrapper>
);
```

## Widget setup
1. You must install plugin by following the steps above to add widget to your Overview


2. Add a widget to the overview tab to the [entityPage.tsx](https://github.com/backstage/backstage/blob/master/packages/app/src/components/catalog/EntityPage.tsx) source file:

```ts
import {
  isFirebaseFunctionsAvailable,
  EntityFirebaseFunctionsCard
} from '@roadiehq/backstage-plugin-firebase-functions';

...

const overviewContent = (
  <Grid container spacing={3}>
    ...
    <EntitySwitch>
      <EntitySwitch.Case if={isFirebaseFunctionsAvailable}>
        <Grid item md={6}>
          <EntityFirebaseFunctionsCard />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
    ...
  </Grid>
);

```

## How to use Firebase Functions plugin in Backstage

To start using it for your component, you have to:

1. add annotation to the yaml config file of a component:

```yml
cloud.google.com/function-ids: projects/<project-name>/locations/<region-name>/functions/<function-name>
```

## Develop plugin locally

You can clone the plugin repo into the `backstage/plugins/` directory:


```sh
git clone https://github.com/RoadieHQ/backstage-plugin-firebase-functions.git firebase-functions
```

and run `yarn install` in the root backstage directory - it will create a symbolic link so the dependency will be provided from the source code instead of `node_modules` package.

## Links

- [Backstage](https://backstage.io)
- [Further instructons](https://roadie.io/backstage/plugins/firebase-functions/)
- Get hosted, managed Backstage for your company: https://roadie.io
