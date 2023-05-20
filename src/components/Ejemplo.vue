<template>
  <v-container fluid>
    <v-card>
      <v-card-title>Esto es un ejemplo</v-card-title>
      <v-divider></v-divider>
      <v-container col-12 grid-list-xs class="pa-5">
        <v-card-text>
        </v-card-text>
      </v-container>
      <v-card-actions>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
  export default {
    name: 'App',
    data: () => ({
      drawer:true,
    }),
  };
</script>
