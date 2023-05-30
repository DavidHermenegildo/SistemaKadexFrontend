<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Clientes</v-toolbar-title>
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
                                    <v-text-field v-model="cNombre" label="Nombre">                                        
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-select v-model="idTipoDocumento"
                                    :items="TipoDocumento" label="Tipo documento">
                                    </v-select>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-select v-model="idTipoPersona"
                                    :items="TipoPersona" label="Tipo persona">
                                    </v-select>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="cDocumento" label="Documento">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="cNumeroTelefono" label="Teléfono">
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="cCorreoCliente" label="Email">
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
                            <span v-if="adAccion==2">desactivar </span> el item {{adNombre}}
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
                :items   = "clientes"
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
                clientes:[],
                headers: [
                    { text: 'Opciones',         value: 'opciones',        sortable: false },
                    { text: 'Nombre',           value: 'cNombre',         sortable: true  },
                    { text: 'Tipo Documento',   value: 'cTipoDocumento',  sortable: true  },
                    { text: 'Número Documento', value: 'cDocumento',      sortable: false },
                    { text: 'Tipo Persona',     value: 'cTipoPersona',    sortable: true  },
                    { text: 'Teléfono',         value: 'cNumeroTelefono', sortable: false },
                    { text: 'Email',            value: 'cCorreoCliente',  sortable: false },
                    { text: 'Estado',           value: 'lVigente',        sortable: false } 
                ],
                editedIndex:        -1,
                idCliente:          '',
                cNombre:            '',
                idTipoDocumento:    '',
                TipoDocumento:      [],
                idTipoPersona:      '',
                TipoPersona:        [],
                cDocumento:         '',
                cNumeroTelefono:    '',
                cCorreoCliente:     '',
                lVigente:           '',
                valida:             0,
                validaMensaje:      [],
                adModal:            0,
                adAccion:           0,
                adNombre:           '',
                adId:               ''
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
            this.listarTipoDoc();
            this.listarTipoPer();
        },
        methods: {
            listar(){
                let me=this;
                let header={"Token" : this.$store.state.token};
                let configuracion= {headers : header};            
                axios.get('Api/Cliente/Listar',configuracion).then(function (response){
                    me.clientes=response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },
            listarTipoDoc(){
                let me=this;
                let header={"Token" : this.$store.state.token};
                let configuracion = {headers : header};
                var tipoDocArray = [];            
                axios.get('Api/Tipo/ListarTipoDoc', configuracion).then(function (response){
                    tipoDocArray = response.data;
                    tipoDocArray.map(function(x){
                        me.TipoDocumento.push({text: x.cTipoDocumento, value: x.idTipoDocumento})
                    });
                }).catch(function(error){
                    console.log(error);
                });
            },
            listarTipoPer(){
                let me=this;
                let header={"Token" : this.$store.state.token};
                let configuracion = {headers : header};
                var tipoPerArray = [];           
                axios.get('Api/Tipo/ListarTipoPer', configuracion).then(function (response){
                    tipoPerArray = response.data;
                    tipoPerArray.map(function(x){
                        me.TipoPersona.push({text: x.cTipoPersona, value: x.idTipoPersona})
                    });
                }).catch(function(error){
                    console.log(error);
                });
            },
            limpiar(){
                this.idCliente       = '';
                this.cNombre         = '';
                this.idTipoDocumento = '';
                this.idTipoPersona   = '';
                this.cDocumento      = '';
                this.cNumeroTelefono = '';
                this.cCorreoCliente  = '';
                this.valida          = 0;
                this.validaMensaje   = [];
                this.editedIndex     = -1;
            },
            validar(){
                this.valida=0;
                this.validaMensaje=[];
                if(this.cNombre.length < 1 || this.cNombre.length > 50){
                    this.validaMensaje.push('El nombre de la persona debe tener entre 1-50 caracteres.');
                }
                if(this.cDocumento.length>20){
                    this.validaMensaje.push('El documento no debe tener más de 20 caracteres.');
                }
                //if(this.direccion.length>70){
                //    this.validaMensaje.push('La dirección no debe tener más de 70 caracteres.');
                //}
                if(this.cNumeroTelefono.length>20){
                    this.validaMensaje.push('El teléfono no debe tener más de 20 caracteres.');
                }
                if(this.cCorreoCliente.length>50){
                    this.validaMensaje.push('El email del usuario debe tener menos de 50 caracteres.');
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
                    axios.put('Api/Cliente/Actualizar',{
                        'idCliente'         : this.idCliente,
                        'cNombre'           : this.cNombre,
                        'idTipoDocumento'   : this.idTipoDocumento,
                        'idTipoPersona'     : this.idTipoPersona,
                        'cDocumento'        : this.cDocumento,
                        'cNumeroTelefono'   : this.cNumeroTelefono,
                        'cCorreoCliente'    : this.cCorreoCliente,
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
                    axios.post('Api/Cliente/Crear',
                    {
                        'cNombre'           : this.cNombre,
                        'idTipoDocumento'   : this.idTipoDocumento,
                        'idTipoPersona'     : this.idTipoPersona,
                        'cDocumento'        : this.cDocumento,
                        'cNumeroTelefono'   : this.cNumeroTelefono,
                        'cCorreoCliente'    : this.cCorreoCliente
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
                this.idCliente          = item.idCliente;
                this.cNombre            = item.cNombre;
                this.idTipoDocumento    = item.idTipoDocumento;
                this.idTipoPersona      = item.idTipoPersona;
                this.cDocumento         = item.cDocumento;
                this.cNumeroTelefono    = item.cNumeroTelefono;
                this.cCorreoCliente     = item.cCorreoCliente;
                this.lVigente           = item.lVigente
                this.dialog             = true;
                this.editedIndex        = 1;
            },
            activarDesactivarMostrar(accion, item){
                this.adModal    = 1;
                this.adNombre   = item.cNombre;
                this.adId       = item.idCliente;
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
                axios.put('Api/Cliente/Activar/' + this.adId, {}, configuracion)
                    .then(function(response){
                        me.adModal  = 0;
                        me.adAccion = 0;
                        me.adNombre = '';
                        me.adId     = '';
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
                axios.put('Api/Cliente/Desactivar/' + this.adId, {}, configuracion)
                    .then(function(response){
                        me.adModal  = 0;
                        me.adAccion = 0;
                        me.adNombre = '';
                        me.adId     = '';
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