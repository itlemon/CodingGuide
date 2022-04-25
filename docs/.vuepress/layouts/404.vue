<template>
  <BaseLayout>
    <template #content>
      <v-container class="text-center">
        <div class="py-6"/>
        <h1>Oops!</h1>
        <p>Nothing to see here.</p>
        <v-btn class="cyan--text text--darken-3"
               exact :to="'/'" text>Go home
        </v-btn>
      </v-container>
    </template>
  </BaseLayout>
</template>

<script>
export default {
  name: "NotFound"
};
</script>