<template>
  <v-app id="app">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      fixed
      app
    >
      <v-list dense>
        <template>
          <v-list-item-group color="primary">
            <v-list-item :to="{ path: '/inicio'}">
              <v-list-item-icon>
                <v-icon>home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Inicio</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </template>
        <template>
          <v-list-group :value="false">
            <template v-slot:activator>
              <v-list-item-content>
                  <v-list-item-title>Almacen</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item :to="{ path: '/ejemplo'}">
              <v-list-item-icon>
                <v-icon>production_quantity_limits</v-icon>
              </v-list-item-icon>
            <v-list-item-title>Nuevo Ejemplo</v-list-item-title>              
            </v-list-item>
            <v-list-item :to="{ path: '/valor2'}">
              <v-list-item-icon>
                <v-icon>production_quantity_limits</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Nuevo Ejemplo</v-list-item-title>              
            </v-list-item>            
          </v-list-group>
        </template>
        <template>
          <v-list-group :value="false">
            <template v-slot:activator>
              <v-list-item-content>
                  <v-list-item-title>Compras</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item :to="{ path: '/ejemplo'}">
              <v-list-item-icon>
                <v-icon>production_quantity_limits</v-icon>
              </v-list-item-icon>
            <v-list-item-title>Nuevo Ejemplo</v-list-item-title>              
            </v-list-item>
            <v-list-item :to="{ path: '/proveedores'}">
              <v-list-item-icon>
                <v-icon>reduce_capacity</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Proveedores</v-list-item-title>              
            </v-list-item>            
          </v-list-group>
        </template>
        <template>
          <v-list-group :value="false">
            <template v-slot:activator>
              <v-list-item-content>
                  <v-list-item-title>Ventas</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item :to="{ path: '/clientes'}">
              <v-list-item-icon>
                <v-icon>production_quantity_limits</v-icon>
              </v-list-item-icon>
            <v-list-item-title>Clientes</v-list-item-title>              
            </v-list-item>
            <v-list-item :to="{ path: '/Producto'}">
              <v-list-item-icon>
                <v-icon>production_quantity_limits</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Producto</v-list-item-title>              
            </v-list-item>            
          </v-list-group>
        </template>
        <template>
          <v-list-group :value="false">
            <template v-slot:activator>
              <v-list-item-content>
                  <v-list-item-title>Accesos</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item :to="{ path: '/ejemplo'}">
              <v-list-item-icon>
                <v-icon>production_quantity_limits</v-icon>
              </v-list-item-icon>
            <v-list-item-title>Nuevo Ejemplo</v-list-item-title>              
            </v-list-item>
            <v-list-item :to="{ path: '/valor2'}">
              <v-list-item-icon>
                <v-icon>production_quantity_limits</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Nuevo Ejemplo</v-list-item-title>              
            </v-list-item>            
          </v-list-group>
        </template>
        <template>
          <v-list-group :value="false">
            <template v-slot:activator>
              <v-list-item-content>
                  <v-list-item-title>Consultas</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item :to="{ path: '/ejemplo'}">
              <v-list-item-icon>
                <v-icon>production_quantity_limits</v-icon>
              </v-list-item-icon>
            <v-list-item-title>Nuevo Ejemplo</v-list-item-title>              
            </v-list-item>
            <v-list-item :to="{ path: '/valor2'}">
              <v-list-item-icon>
                <v-icon>production_quantity_limits</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Nuevo Ejemplo</v-list-item-title>              
            </v-list-item>            
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer> 
    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue darken-3"
      dark
    >
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <!--span class="hidden-sm-and-down">Kardex</span-->
      </v-toolbar-title>      
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container
        fluid
        fill-height
      >
        <v-slide-y-transition mode="out-in">
          <router-view/>
        </v-slide-y-transition>
      </v-container>
    </v-main>
    <v-footer color="primary" padless>
      <v-row justify="center" no-gutters>
        <v-col
          class="primary lighten py-4 text-center white--text"
          cols="top"
        >
          <strong>Kardex</strong> &copy; {{ new Date().getFullYear() }}
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    name: 'App',
    data: () => ({
      drawer:true,
    }),
  };
</script>
