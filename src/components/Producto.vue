<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Producto</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field class="text-xs-center" v-model="search" append-icon="search" 
                label="Búsqueda" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo</v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                        </v-card-title>            
                        <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="cProducto" label="Producto">                                        
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="nPrecio" label="Precio">                                        
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="nCantidad" label="Cantidad">                                        
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="cDescripcion" label="Descripción">                                        
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12 v-show="valida">
                                    <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">

                                    </div>
                                </v-flex>
                            </v-layout>
                        </v-container>
                        </v-card-text>            
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                        <v-btn color="blue darken-1" text @click="guardar">Guardar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="adModal" max-width="290">
                    <v-card>
                        <v-card-title class="headline" v-if="adAccion==1">
                            Activar Item
                        </v-card-title>
                        <v-card-title class="headline" v-if="adAccion==2">
                            Desactivar Item
                        </v-card-title>
                        <v-card-text>
                            Estás a punto de <span v-if="adAccion==1">activar </span>
                            <span v-if="adAccion==2">desactivar </span> el item {{adNombreProducto}}
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn @click="activarDesactivarCerrar()" color="blue darken-1" text="text">
                                Cancelar
                            </v-btn>
                            <v-btn v-if="adAccion==1" @click="activar()" color="blue darken-1" text="text">
                                Activar
                            </v-btn>
                            <v-btn v-if="adAccion==2" @click="desactivar()" color="blue darken-1" text="text">
                                Desactivar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
            <v-data-table
                :headers = "headers"
                :items   = "productos"
                :search  = "search"
                class    = "elevation-1"
            >
                <template v-slot:[`item.opciones`]="{ item }">
                    <td>
                        <v-icon
                        small
                        class="mr-2"
                        @click="editItem(item)"
                        >
                        edit
                        </v-icon>
                        <template v-if="item.lVigente">
                            <v-icon
                            small
                            @click="activarDesactivarMostrar(2, item)"
                            >
                            check
                            </v-icon>
                        </template>
                        <template v-else>
                            <v-icon
                            small
                            @click="activarDesactivarMostrar(1, item)"
                            >
                            block
                            </v-icon>
                        </template>
                    </td>
                </template>
                <template v-slot:[`item.lVigente`]="{ item }">
                    <td>
                        <div v-if="item.lVigente">
                            <span class="blue--text">Activo</span>
                        </div>
                        <div v-else>
                            <span class="red--text">Inactivo</span>
                        </div>
                    </td>                
                </template>
                <template v-slot:no-data>
                <v-btn color="primary" @click="listar()">Resetear</v-btn>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>
<script>
    import axios from 'axios'

    export default {
        data(){
            return{
                dialog: false,
                search: '',
                productos:[],
                headers: [
                    { text: 'Opciones',         value: 'opciones',        sortable: false },
                    { text: 'Producto',         value: 'cProducto',       sortable: true  },
                    { text: 'Precio',           value: 'cPrecioProd',     sortable: true  },
                    { text: 'Cantidad',         value: 'nCantidadProd',   sortable: false },
                    { text: 'Descripción',      value: 'cDescripcion',    sortable: false },
                    { text: 'Estado',           value: 'lVigente',        sortable: false } 
                ],
                editedIndex:        -1,
                valida:             0,
                validaMensaje:      [],
                adModal:            0,
                adAccion:           0,
                adNombreProducto:   '',
                adId:               '',

                //------------------------------
                idProducto :     '',
                cProducto :      '',
                nPrecio :        '',
                nCantidad :      0,
                cDescripcion :   '',
                lVigente:        ''
            }
        },
        computed: {
            formTitle () {
            return this.editedIndex === -1 ? 'Nuevo registro' : 'Editar registro'
            }
        },
        watch: {
            dialog (val) {
            val || this.close()
            }
        },
        created () {
            this.listar();
        },
        methods: {
            listar(){
                let me=this;
                let header={"Token" : this.$store.state.token};
                let configuracion= {headers : header};            
                axios.get('Api/Producto/Listar',configuracion).then(function (response){
                    me.productos=response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },
            limpiar(){
                this.idProducto =       '';
                this.cProducto =        '';
                this.nPrecio =          '';
                this.nCantidad =        '';
                this.cDescripcion =     '';
                this.valida =           0;
                this.validaMensaje =    [];
                this.editedIndex =      -1;
            },
            validar(){
                this.valida=0;
                this.validaMensaje=[];
                if(this.cProducto.length < 1 || this.cProducto.length > 50){
                    this.validaMensaje.push('El nombre del producto debe tener entre 1-50 caracteres.');
                }
                if(this.cDescripcion.length < 1 || this.cDescripcion.length > 100){
                    this.validaMensaje.push('La descripcion debe de contener entre 1-100 caracteres.');
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            guardar(){
                let me=this;
                let header={"Token" : this.$store.state.token};
                let configuracion= {headers : header};
                if (this.validar()){
                    return;
                }
                if (this.editedIndex >-1){
                    //Código para editar
                    axios.put('Api/Producto/Actualizar',{
                        'idProducto'        : this.idProducto,
                        'cProducto'         : this.cProducto,
                        'cPrecioProd'       : this.nPrecio.toString(),
                        'nCantidadProd'     : this.nCantidad,
                        'cDescripcion'      : this.cDescripcion,
                        'lVigente'          : this.lVigente,
                    },configuracion)
                    .then(function(response){
                        me.limpiar();
                        me.close();
                        me.listar();
                    })
                    .catch(function(error){
                        console.log(error);
                    });
                }else{
                    //Código para guardar
                    axios.post('Api/Producto/Crear',
                    {
                        'cProducto'         : this.cProducto,
                        'cPrecioProd'       : this.nPrecio.toString(),
                        'nCantidadProd'     : parseInt(this.nCantidad),
                        'cDescripcion'      : this.cDescripcion,
                    },configuracion)
                    .then(function(response){
                        me.limpiar();
                        me.close();
                        me.listar();
                    })
                    .catch(function(error){
                        console.log(error);
                    });
                }
            },
            editItem (item) {
                this.idProducto         = item.idProducto;
                this.cProducto          = item.cProducto;
                this.nPrecio            = item.cPrecioProd;
                this.nCantidad          = item.nCantidadProd;
                this.cDescripcion       = item.cDescripcion;
                this.lVigente           = item.lVigente
                this.dialog             = true;
                this.editedIndex        = 1;
            },
            activarDesactivarMostrar(accion, item){
                this.adModal            = 1;
                this.adNombreProducto   = item.cProducto;
                this.adId               = item.idProducto;
                if (accion == 1){
                    this.adAccion =1 ;
                } else if(accion == 2){
                    this.adAccion = 2;
                } else{
                    this.adModal = 0;
                }
            },
            activarDesactivarCerrar(){
                this.adModal=0;
            },
            activar(){
                let me=this;
                let header={"Token" : this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('Api/Producto/Activar/' + this.adId, {}, configuracion)
                    .then(function(response){
                        me.adModal          = 0;
                        me.adAccion         = 0;
                        me.adNombreProducto = '';
                        me.adId             = '';
                        me.listar();
                    })
                    .catch(function(error){
                        console.log(error);
                    });
            },
            desactivar(){
                let me=this;
                let header={"Token" : this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('Api/Producto/Desactivar/' + this.adId, {}, configuracion)
                    .then(function(response){
                        me.adModal          = 0;
                        me.adAccion         = 0;
                        me.adNombreProducto = '';
                        me.adId             = '';
                        me.listar();
                    })
                    .catch(function(error){
                        console.log(error);
                    });
            },
            close () {
                this.dialog = false;
                this.limpiar();
            }
        }
    }
</script>