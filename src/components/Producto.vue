<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Producto</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field class="text-xs-center" v-model="search" append-icon="search" 
                label="Búsqueda" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
                <v-btn class="mb-2 mr-3" fab outlined small color="primary" @click="imprimirA4"><v-icon color="primary">print</v-icon></v-btn>
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
                                    <v-text-field v-model="cCodProducto" label="Código">                                        
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
    import jsPDF from 'jspdf'; 
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
                    { text: 'Código',           value: 'cCodProducto',    sortable: false },
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
                cCodProducto:    '',
                cDescripcion :   '',
                lVigente:        '',
                nNumero:         0,
                cResultado:      ''
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
                this.cCodProducto =     ''; 
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
                        'nCantidadProd'     : parseInt(this.nCantidad),
                        'cCodProducto'      : this.cCodProducto.toString(),
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
                        'cCodProducto'      : this.cCodProducto.toString(),
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
                this.cCodProducto       = item.cCodProducto;
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
            },
            imprimirA4(){
                require('jspdf-autotable');
                var opciones = {
                    orientation: 'p',
                    unit: 'mm',
                    format: [210, 297]
                };

                var logo = 'https://thumbs.dreamstime.com/b/s%C3%ADmbolo-de-comercio-v%C3%ADas-flecha-con-dise%C3%B1os-logotipo-laptop-dise%C3%B1o-vectorial-comercial-maneras-online-venta-tienda-compra-171844391.jpg';
                var doc = new jsPDF(opciones);
                
                doc.addImage(logo, 'JPG', 15, 15, 40, 40)

                doc.setFont(undefined, 'bold');
                doc.setFontSize(11);
                doc.text(60, 25, "NOMBRE DE LA EMPRESA S.A.C.");
                doc.setFont(undefined, 'normal');

                doc.setFontSize(10);
                doc.text(60, 35, "PJ. DANTE NAVA MZ. T. LT. 8 - PRADERAS DEL INKA");

                doc.setFontSize(10);
                doc.text(60, 40, "PUNO - SAN ROMÁN - JULIACA");

                doc.setFontSize(10);
                doc.text(60, 45, "Celular 951777163");

                doc.setFontSize(10);
                doc.text(60, 50, "Email ferming@gmail.com");

                doc.rect(150, 20, 45, 30);

                doc.setFont(undefined, 'bold');
                doc.setFontSize(10);
                doc.text(60, 65, "RAZÓN SOCIAL:","right");
                doc.setFont(undefined, 'normal');
                doc.text(61, 65, "GRUPO HNOS CONDORI S.A.C.", "left");

                doc.setFont(undefined, 'bold');
                doc.setFontSize(10);
                doc.text(60, 70, "RUC:", "right");
                doc.setFont(undefined, 'normal');
                doc.text(61, 70, "20601902878", "left");

                doc.setFont(undefined, 'bold');
                doc.setFontSize(10);
                doc.text(60, 75, "DIRECCIÓN:","right");
                doc.setFont(undefined, 'normal');
                doc.text(61, 75, "JR. MARIANO NUÑEZ NRO. 610 URB.CERCADO, PUNO - SAN ROMÁN - JULIACA", "left");

                doc.setFont(undefined, 'bold');
                doc.setFontSize(10);
                doc.text(60, 80, "EMISIÓN:","right");
                doc.setFont(undefined, 'normal');
                doc.text(61, 80, "2022-02-2015 12:40:23", "left");

                doc.setFont(undefined, 'bold');
                doc.setFontSize(10);
                doc.text(60, 85, "MONEDA:","right")
                doc.setFont(undefined, 'normal');
                doc.text(61, 85, "SOL (PEN)", "left")

                doc.setFont(undefined, 'bold');
                doc.setFontSize(10);
                doc.text(60, 90, "FORMA DE PAGO:","right")
                doc.setFont(undefined, 'normal');
                doc.text(61, 90, "CONTADO", "left")
                
                var datos = [];
                var nPrecioTotal = 0;
                var nCantatidadTotal = 0;
                var columns = ["Producto", "Precio", "Cantidad", "Descripción"];

                this.productos.forEach((product) => {
                    datos.push([product.cProducto.toString(), 
                                product.cPrecioProd.toString(), 
                                product.nCantidadProd.toString(),
                                product.cDescripcion.toString()])
                    nPrecioTotal = (nPrecioTotal + parseFloat(product.cPrecioProd.toString()));
                    nCantatidadTotal = nCantatidadTotal + parseInt(product.nCantidadProd);
                });

                doc.autoTable(columns,datos,
                    { margin:{ top: 100 }}
                );

                var filaTablas = (datos.length)*11.5;

                doc.setFontSize(10);
                doc.text(160, (100+filaTablas), "Precio Total","right")
                doc.text(195, (100+filaTablas), nPrecioTotal.toString(), "right")

                doc.setFontSize(10);
                doc.text(160, (105+filaTablas), "Cantidad Total","right")
                doc.text(195, (105+filaTablas), nCantatidadTotal.toString(), "right")

                this.nNumero = nPrecioTotal;
                this.traducir();

                doc.line(15, (110+filaTablas), 195, (110+filaTablas))
                doc.setFont(undefined, 'bold');
                doc.setFontSize(10);
                doc.text(25, (116+filaTablas), "SON:","right")
                doc.setFont(undefined, 'normal');
                doc.text(26, (116+filaTablas), this.cResultado.toString(), "left")
                doc.line(15, (120+filaTablas), 195, (120+filaTablas))
                var fecha = new Date();
                doc.save('Productos' + fecha.toLocaleDateString() + '.pdf');
            },
            traducir() {
                const unidades = [
                    'cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
                    'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'
                ];
                
                const decenas = [
                    '', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'
                ];
                const centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

                const partes = String(this.nNumero).split('.');
                const parteEntera = Number(partes[0]);
                const parteDecimal = Number(partes[1]) || 0;

                function describirEntero(numero) {
                    let descripcion = '';

                    if (numero === 0) {
                    descripcion = 'cero';
                    } else if (numero < 20) {
                    descripcion = unidades[numero];
                    } else if (numero < 100) {
                    descripcion = decenas[Math.floor(numero / 10)];
                        if (numero % 10 !== 0) {
                            descripcion += ' y ' + unidades[numero % 10];
                        }
                    }
                    else if (numero < 1000) {
                    descripcion = centenas[Math.floor(numero / 100)];
                    let resto = numero % 100;
                    if (resto !== 0) {
                        if (resto < 20) {
                        descripcion += ' ' + especiales[resto];
                        } else {
                        descripcion += ' ' + decenas[Math.floor(resto / 10)];
                        if (resto % 10 !== 0) {
                            descripcion += ' y ' + unidades[resto % 10];
                        }
                        }
                    }
                    }
                    return descripcion;
                }

                const descripcionEntera = describirEntero(parteEntera);
                const descripcionDecimal = describirEntero(parteDecimal);

                let descripcionCompleta = descripcionEntera;
                if (descripcionDecimal) {
                    descripcionCompleta += ' punto ' + descripcionDecimal;
                }

                this.cResultado = descripcionCompleta.toUpperCase();
            }
        }
    }
</script>