# Firebase Functions Plugin for Backstage

![details in the Firebase Functions plugin for Backstage](https://raw.githubusercontent.com/RoadieHQ/backstage-plugin-firebase-functions/master/docs/firebase-function-details.png)

[https://roadie.io/backstage/plugins/firebase-functions](https://roadie.io/backstage/plugins/firebase-functions)

## Features

- Display firebase functions details
- link to overview or logs in the cloud google platform console

## How to add firebase-functions project dependency to Backstage app

If you have your own Backstage application without this plugin, here's how to add it:

1. In the `backstage/packages/app` project add the plugin as a `package.json` dependency:

```bash
yarn add @roadiehq/backstage-plugin-firebase-functions
```

2. Add plugin to the `EntityPage.tsx` source file:

```tsx
// packages/app/src/components/catalog/EntityPage.tsx
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

2. Add widget to your Overview tab:

```ts
// packages/app/src/components/catalog/EntityPage.tsx
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

You can clone the plugin repo into the `packages/` directory:

```sh
git clone https://github.com/RoadieHQ/backstage-plugin-firebase-functions.git firebase-functions
```

and run `yarn` in the root backstage directory - it will create a symbolic link so the dependency will be provided from the source code instead of `node_modules` package.

## Links

- [Backstage](https://backstage.io)
- [Further instructons](https://roadie.io/backstage/plugins/firebase-functions/)
- Get hosted, managed Backstage for your company: https://roadie.io
