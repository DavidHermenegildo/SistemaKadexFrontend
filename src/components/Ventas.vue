<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Ventas</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field v-if="verNuevo==0" class="text-xs-center" v-model="search" append-icon="search" 
                label="Búsqueda" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="primary" v-if="verNuevo==0" @click="mostrarNuevo()" dark class="mb-2">Nuevo</v-btn>
                <v-dialog v-model="dialog" max-width="1000px">
                    <v-card>
                        <v-card-title> 
                            <span class="headline">Seleccione un producto</span>
                        </v-card-title>            
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs12 sm12 md12 lg12 xl12>                                        
                                        <v-text-field v-model="texto" @keyup.enter="listarProducto()" class="text-xs-center" append-icon="search" 
                                        label="Búsqueda"></v-text-field>
                                        <template>
                                            <v-data-table
                                                :headers="CabeceraProductos"
                                                :items="Productos"
                                                class="elevation-1"
                                            >
                                                <template v-slot:[`item.seleccionar`]="{ item }">
                                                    <td>
                                                        <v-icon
                                                        small
                                                        class="mr-2"
                                                        @click="agregarDetalle(item)"
                                                        >
                                                        add
                                                        </v-icon>                                                    
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
                                            </v-data-table>
                                        </template>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>            
                        <v-card-actions>
                        <v-spacer></v-spacer>
                            <v-btn class="mr-2" color="blue darken-1" style="color: white;" flat @click="close">Cancelar</v-btn>
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
                <v-dialog v-model="comprobanteModal" max-width="1200px">
                    <v-card>
                        <v-card-title>
                            <v-btn color="blue darken-1" style="color: white;"><v-icon>print</v-icon></v-btn>
                            <v-spacer></v-spacer>
                            <v-btn @click="ocultarComprobante" color="blue darken-1" style="color: white;" flat>Cancelar</v-btn>
                        </v-card-title>
                        <v-card-text>
                            <div id="factura">
                                <header>
                                    <div>
                                        <table id="facarticulo">
                                            <tr>
                                                <td style="text-align: center; width: 70px;">
                                                    <img src="https://static.wixstatic.com/media/991a63_8557bb637b3441408efd2a8d28ecab5d~mv2.png/v1/fill/w_940,h_324,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/LOGO-OSO-LARGO.png" id="imagen">
                                                </td>
                                                <td rowspan="12" style="width: 30px; border: 1px solid black" border="1">
                                                    <table id="tabla" style="text-align: center;">
                                                        <tr id="titulo3">&nbsp;</tr>
                                                        <tr>
                                                            <td id="titulo4">RUC: 20601255601</td>
                                                        </tr>
                                                        <tr id="titulo3">&nbsp;</tr>
                                                        <tr>
                                                            <td id="titulo3" style="height: 70px;">{{ cTipoComprobante }}</td>
                                                        </tr>
                                                        <tr id="titulo3">&nbsp;</tr>
                                                        <tr>
                                                            <td id="titulo4">NRO: {{cSerieComprobante}}-{{cNumComprobante}}</td>
                                                        </tr>
                                                        <tr id="titulo3">&nbsp;</tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-xs-center" style="text-align: center;" id="letra" width="80%" height = "30px">L&Y SARMIENTO E.I.R.L
                                                    <br><p>Distribuidor Autorizado</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <table id="tabla">
                                                    <tr>
                                                        <td width="11%" id="letra">Dirección</td>
                                                        <td width="50%">
                                                            <label for="">: CAL.CALLE 09 MZA. G1 LOTE. 6 URB. SAN JULIAN (SALIDA AREQUIPA)</label>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td width="11%" id="letra">Distribuidor </td>
                                                        <td width="50%">
                                                            <label for="">: PUNO - JULIACA</label>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td width="11%" id="letra">Teléfono</td>
                                                        <td width="50%">
                                                            <label for="">: 929122146</label>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td width="11%" id="letra">Gmail</td>
                                                        <td width="50%">
                                                            <label for="">: sarmiento@Gmail.com</label>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </tr>
                                        </table>
                                    </div>
                                </header>
                                <section class="facliente">
                                    <table id="tabla">
                                        <tr>
                                            <td style="text-align: center;" id="TablaBorde" colspan="8" width="100%">
                                                INFORMACIÓN GENERAL
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="15%" id="letra">Señor(es)</td>
                                            <td width="50%">
                                                <label for="">: {{ cNombre }}</label>
                                            </td>
                                            <td colspan="2"></td>
                                            <td width="15%" id="letra">Moneda</td>
                                            <td width="20%">
                                                <label for="">: Soles</label>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="15%" id="letra">Documento</td>
                                            <td width="50%">
                                                <label for="">: {{ cDocumento }}</label>
                                            </td>
                                            <td colspan="2"></td>
                                            <td width="15%" id="letra">Condición de Pago</td>
                                            <td width="20%">
                                                <label for="">: CONTADO</label>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="15%" id="letra">Dirección</td>
                                            <td width="50%">
                                                <label for="">: {{ cDireccion }}</label>
                                            </td>
                                            <td colspan="2"></td>
                                            <td width="15%" id="letra">Fecha de Emisión</td>
                                            <td width="20%">
                                                <label for="">: {{new Date(dFechaReg).toLocaleString().replace(',', ' -')}}</label>
                                            </td>
                                        </tr>
                                    </table>
                                </section>
                                <br>
                                <section>
                                    <div>
                                        <table id="facarticulo">
                                            <thead>
                                                <tr id="TablaBorde">
                                                    <th style="text-align:left;">CÓDIGO</th>
                                                    <th style="text-align:left;">CANT.</th>
                                                    <th style="text-align:left;">UNIDAD</th>
                                                    <th style="text-align:left;">PRODUCTO</th>
                                                    <th style="text-align:left;">DESC.</th>
                                                    <th style="text-align:left;">PRECIO</th>
                                                    <th style="text-align:left;">IMPORTE</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="det in detalles" :key="det.idDetalleVenta">
                                                    <td style="text-align:left;">{{det.cCodProducto}}</td>
                                                    <td style="text-align:left;">{{ det.nCantidad }}</td>
                                                    <td style="text-align:left;">UNIDAD</td>
                                                    <td style="text-align:left;">{{ det.cProducto }}</td>
                                                    <td style="text-align:left;">{{ (det.nDescuento).toFixed(2) }}</td>
                                                    <td style="text-align:left;">{{ (det.nPrecio).toFixed(2) }}</td>
                                                    <td style="text-align:left;">{{ (det.nCantidad * det.nPrecio - det.nDescuento).toFixed(2) }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                                <hr style="height:2px;border:none;color:#333;background-color:#333;">
                                <section>
                                    <div>
                                        <table id="titulo2">
                                            <thead>
                                                <tr>
                                                    <th style="text-align:left;">Sub Total</th>
                                                    <th style="text-align:left;">Dto. Total</th>
                                                    <th style="text-align:left;">Op. Exonerada</th>
                                                    <th style="text-align:left;">Op. Inafecta</th>
                                                    <th style="text-align:left;">Op. Gravada</th>
                                                    <th style="text-align:left;">Op. Gratuita</th>
                                                    <th style="text-align:left;">ISC</th>
                                                    <th style="text-align:left;">IGV ({{ nImpuesto }}%)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td style="text-align:left;">S/ {{nTotalParcial = (nTotalImp - nTotalImpuestoImp).toFixed(2)}}</td>
                                                    <td style="text-align:left;">{{ nDescuentoTotal.toFixed(2) }}</td>
                                                    <td style="text-align:left;">0.00</td>
                                                    <td style="text-align:left;">0.00</td>
                                                    <td style="text-align:left;">0.00 </td>
                                                    <td style="text-align:left;">0.00</td>
                                                    <td style="text-align:left;">0.00</td>
                                                    <td style="text-align:left;">S/ {{ nTotalImpuestoImp = ((nTotalImp * nImpuesto)/(100 + nImpuesto)).toFixed(2) }}</td>
                                                </tr>
                                            </tbody>
                                            <tfoot>
                                                <br>
                                                <tr>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th style="text-align:left;">TOTAL</th>
                                                    <th style="text-align:left;">S/ {{ nTotalImp = (calcularTotal).toFixed(2) }}</th>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </section>
                                <hr style="height:2px;border:none;color:#333;background-color:#333;">
                                <section>
                                    <div>
                                        <table id="totalLetras">
                                            <tr>
                                                <td>SON: {{ cLetras }}</td>
                                                <!--td class="text-xs-right">NRO. DE ITEMS : 1.</!--td-->
                                            </tr>
                                        </table>
                                    </div>
                                    <hr style="height:2px;border:none;color:#333;background-color:#333;">
                                    <br>
                                    <br>
                                    <div id="gracias">
                                        <p><b>¡GRACIAS POR SU COMPRA!</b></p>
                                    </div>
                                </section>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <hr style="height:2px;border:none;color:#333;background-color:#333;">
                                <br>
                                <footer>
                                    <div>
                                        <table>
                                            <tr>
                                                <td  width="4%" class="text-xs-center">
                                                    <!--qrcode :size="size" :cls="qrCls" :value="qrText"></!--qrcode-->
                                                </td>
                                                <td>&nbsp;</td>
                                                <td id="letra">  SARMIENTO@GMAIL.COM <br>
                                                        REPRESENTACIÓN IMPRESA DE LA {{ cTipoComprobante }} <br>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div style="text-align: right">
                                        <p><span>Página {{ currentPage }}</span></p>
                                    </div>
                                </footer>
                            </div>
                            <!--v-btn color="blue darken-1" flat>Cancelar</!--v-btn-->
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </v-toolbar>
            <v-data-table
                :headers ="headers"
                :items   ="ventas"
                :search  ="search"
                class    ="elevation-1"
                v-if="verNuevo==0"
            >
                <template v-slot:[`item.opciones`]="{ item }">
                    <td>
                        <v-icon small class="mr-2" @click="mostrarComprobante(item)">
                        print
                        </v-icon>
                        <v-icon small class="mr-2" @click="verIngreso(item)">
                            tab
                        </v-icon>
                        <template v-if="item.lVigente">
                            <v-icon
                            small
                            class="mr-2"
                            @click="activarDesactivarMostrar(2, item)"
                            >
                            check
                            </v-icon>
                        </template>
                        <template v-else>
                            <v-icon
                            small
                            class="mr-2"
                            @click="activarDesactivarMostrar(1, item)"
                            >
                            block
                            </v-icon>
                        </template>
                    </td>
                </template>
                <template v-slot:[`item.dFechaReg`]="{ item }">
                    <td>
                        <span>{{new Date(item.dFechaReg).toLocaleString().replace(',', ' -')}}</span>
                    </td>
                </template>
                <template v-slot:[`item.nImpuesto`]="{ item }">
                    <td>
                        <span>{{parseFloat(item.nImpuesto).toFixed(2)}}</span>
                    </td>
                </template>
                <template v-slot:[`item.nTotal`]="{ item }">
                    <td>
                        <span>{{parseFloat(item.nTotal).toFixed(2)}}</span>
                    </td>
                </template>
                <template v-slot:[`item.lVigente`]="{ item }">
                    <td>
                        <div v-if="item.lVigente">
                            <span class="blue--text">Aceptado</span>
                        </div>
                        <div v-else>
                            <span class="red--text">Anulado</span>
                        </div>
                    </td> 
                </template>
                <template v-slot:no-data>
                <v-btn color="primary" @click="listar()">Resetear</v-btn>
                </template>
            </v-data-table>
            <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
                <v-layout row wrap>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-select v-model="idTipoComprobante" 
                        :items="TipoComprobante" label="Tipo Comprobante" :readonly="!editable">
                        </v-select>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field v-model="cSerieComprobante" label="Serie Comprobante" :readonly="!editable">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field v-model="cNumComprobante" label="Número Comprobante" :readonly="!editable">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm8 md8 lg8 xl8>
                        <v-autocomplete :items="cliente" v-model="idCliente" label="Cliente" :readonly="!editable">
                        </v-autocomplete>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field type="number" v-model="nImpuesto" label="Impuesto" :readonly="!editable">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm8 md8 lg8 x8>
                        <v-text-field v-model="codigo" label="Código" @keyup.enter="buscarCodigo()" :readonly="!editable">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 md2 lg2 xl2>
                        <v-btn small fab dark color="teal" @click="mostrarModalArticulos()" :disabled="!editable">
                            <v-icon dark>list</v-icon>
                        </v-btn>
                    </v-flex>
                    <v-flex xs12 sm2 md2 lg2 xl2 v-show="errorArticulo">
                        <div class="red--text" v-text="errorArticulo">

                        </div>
                    </v-flex>
                    <v-flex xs12 sm12 md12 lg12 xl12>
                        <template>
                            <v-data-table
                                :headers="cabeceraDetalles"
                                :items="detalles"
                                hide-default-footer
                                class="elevation-1"
                            >
                                <template v-slot:[`item.borrar`]="{ item }">
                                    <td>
                                        <v-icon
                                        small
                                        class="mr-2"
                                        :disabled="!editable"
                                        @click="eliminarDetalle(detalles, item)"
                                        >
                                        delete
                                        </v-icon>
                                    </td>
                                </template>
                                <template v-slot:[`item.cProducto`]="{ item }">
                                    <td class="text-xs-center">{{ item.cProducto }}</td>
                                </template>
                                <template v-slot:[`item.nCantidad`]="{ item }">
                                    <td class="text-xs-center"><v-text-field v-model.number="item.nCantidad" type="number" :readonly="!editable"></v-text-field></td>
                                </template>
                                <template v-slot:[`item.nPrecio`]="{ item }">
                                    <td class="text-xs-center"><v-text-field v-model.number="item.nPrecio" type="number" :readonly="!editable"></v-text-field></td>
                                </template>
                                <template v-slot:[`item.nDescuento`]="{ item }">
                                    <td class="text-xs-center"><v-text-field v-model.number="item.nDescuento" type="number" :readonly="!editable"></v-text-field></td>
                                </template>
                                <template v-slot:[`item.nSubtotal`]="{ item }">
                                    <td class="text-xs-right">S/. {{ (item.nCantidad * item.nPrecio) - item.nDescuento}}</td>
                                </template>
                                <template slot="no-data">
                                    <h3>No hay productos agregados al detalle.</h3>
                                </template>
                            </v-data-table>
                            <template>
                                <table id="tabla">
                                    <tr>
                                        <td width="10%" id="letra"  style="text-align:left;">
                                            <label>Total Parcial</label>
                                        </td>
                                        <td width="40%">
                                            <label>: S/. {{nTotalParcial = (nTotalImp-nTotalImpuesto).toFixed(2)}}</label>
                                        </td>
                                        <td width="50%"></td>
                                    </tr>
                                    <tr>
                                        <td width="10%" id="letra"  style="text-align:left;">
                                            <label>Total Impuesto</label>
                                        </td>
                                        <td width="40%">
                                            <label>: S/. {{nTotalImpuesto = ((nTotalImp*nImpuesto)/(1+nImpuesto)).toFixed(2)}}</label>
                                        </td>
                                        <td width="50%"></td>
                                    </tr>
                                    <tr>
                                        <td width="10%" id="letra"  style="text-align:left;">
                                            <label>Total Neto</label>
                                        </td>
                                        <td width="40%">
                                            <label>: S/. {{ nTotalImp }}</label>
                                        </td>
                                        <td width="50%"></td>
                                    </tr>
                                </table>
                            </template>
                        </template>
                    </v-flex>
                    <v-flex xs12 sm12 md12 v-show="valida">
                        <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">

                        </div>
                    </v-flex>                    
                    <v-flex xs12 sm12 md12 lg12 xl12>
                        <v-btn class="mr-2" color="blue darken-1" flat @click.native="ocultarNuevo()" style="color: white;">Cancelar</v-btn>
                        <v-btn class="ml-2" color="success" v-if="verDetalle==0" @click.native="guardar()">Guardar</v-btn>
                    </v-flex>
		        </v-layout>
            </v-container>
        </v-flex>
    </v-layout>
</template>
<script>
    import axios from 'axios'
    import jsPDF from 'jspdf'
    import convertidorNumerosLetras from '../utilidades/convertidorNumerosLetras.js';
    export default {
        data(){
            return{
                dialog: false,
                search:'',
                ventas:[],
                headers: [ 
                    { text: 'Opciones',             value: 'opciones',          sortable: false  },
                    { text: 'Usuario',              value: 'cWinUser',          sortable: true   },
                    { text: 'Cliente',              value: 'cNombre',           sortable: true   },
                    { text: 'Tipo Comprobante',     value: 'cTipoComprobante',  sortable: true   },
                    { text: 'Serie comprobante',    value: 'cSerieComprobante', sortable: false  },
                    { text: 'Num. comprobante',     value: 'cNumComprobante',   sortable: false  },
                    { text: 'Fecha',                value: 'dFechaReg',         sortable: false  },
                    { text: 'Impuesto',             value: 'nImpuesto',         sortable: false  },
                    { text: 'Total',                value: 'nTotal',            sortable: false  },
                    { text: 'Estado',               value: 'lVigente',          sortable: false  }                
                ],
                idVenta             : '',
                idCliente           : '',
                cliente             : [],
                idTipoComprobante   : '',
                TipoComprobante     : [],
                cSerieComprobante   : '',
                cNumComprobante     : '',
                nImpuesto           : 0.18,
                codigo              : '',
                cabeceraDetalles:[
                    { text: 'Borrar',           value: 'borrar',            sortable: false },
                    { text: 'Producto',         value: 'cProducto',         sortable: false },
                    { text: 'Cantidad',         value: 'nCantidad',         sortable: false },
                    { text: 'Precio',           value: 'nPrecio',           sortable: false },
                    { text: 'Descuento',        value: 'nDescuento',        sortable: false },
                    { text: 'Sub Total',        value: 'nSubtotal',         sortable: false }
                ],
                detalles            : [],
                verNuevo            : 0,
                errorArticulo       : null,
                nTotal              : 0,
                nTotalParcial       : 0,
                nTotalImpuesto      : 0,
                Productos           : [],
                texto               : '',
                CabeceraProductos: [
                    { text: 'Seleccionar',      value: 'seleccionar',       sortable: false },
                    { text: 'Código',           value: 'cCodProducto',      sortable: false},
                    { text: 'Nombre',           value: 'cProducto',         sortable: true},
                    { text: 'Stock',            value: 'nCantidadProd',     sortable: false},
                    { text: 'Precio Venta',     value: 'cPrecioProd',       sortable: false},
                    { text: 'Descripción',      value: 'cDescripcion',      sortable: false },              
                    { text: 'Estado',           value: 'lVigente',          sortable: false }
                ],
                verDetalle          : 0,
                valida              : 0,
                validaMensaje       : [],
                adModal             : 0,
                adAccion            : 0,
                adNombre            : '',
                adId                : '',
                comprobanteModal    : 0,
                cTipoComprobante    : '',
                cNombre             : '',
                cDocumento          : '',
                cNumeroTelefono     : '',
                cCorreoCliente      : '',
                cDireccion          : '',
                dFechaReg           : '',
                nTotalImpuestoImp   : 0,
                nTotalImp           : 0,
                cNumLetras          : '',
                cLetras             : '',
                currentPage         : 1,
                totalPages          : 0,
                totalItems          : 0,
                itemsPerPage        : 10,
                editable            : false
            }
        },
        mounted() {
            this.totalPages = this.updateTotalPages;
        },
        computed: {
            calcularTotal: function(){
                let resultado = 0.0;
                if (this.detalles && this.detalles.length)
                {
                    for(var i = 0; i < this.detalles.length; i++){
                        resultado = resultado + ((this.detalles[i].nCantidad * this.detalles[i].nPrecio) - this.detalles[i].nDescuento);
                    }
                }
                this.cLetras = convertidorNumerosLetras(this.nTotalImp);
                return resultado;
            },
            nDescuentoTotal() {
                return this.detalles.reduce((total, det) => total + parseFloat(det.nDescuento), 0);
            },
            updateTotalPages() {
                return Math.ceil(this.totalItems / this.itemsPerPage);
            },
        },
        watch: {
            dialog (val) {
                val || this.close()
            },
            currentPage(newValue) {
                this.totalPages = this.updateTotalPages;
            },
            totalItems(newValue) {
                this.totalPages = this.updateTotalPages;
            },
        },
        created () {
            this.listar();
            this.selectCliente();
            this.selectTipoComprobante();
        },
        methods: {
            mostrarComprobante(item){
                this.limpiar();
                this.cTipoComprobante   = item.cTipoComprobante;
                this.cSerieComprobante  = item.cSerieComprobante;
                this.cNumComprobante    = item.cNumComprobante;
                this.cNombre            = item.cNombre;
                this.cDocumento         = item.cDocumento;
                this.cNumeroTelefono    = item.cNumeroTelefono;
                this.cCorreoCliente     = item.cCorreoCliente;
                this.cDireccion         = item.cDireccion;
                this.dFechaReg          = item.dFechaReg;
                this.nImpuesto          = item.nImpuesto;
                this.comprobanteModal   = 1;
                this.listarDetalles(item.idVenta);
                console.log(item.idVenta);
            },
            ocultarComprobante(){
                this.comprobanteModal = 0;
                this.limpiar();
            },
            selectCliente(){
                let me              = this;
                let clienteArray    = [];
                let header          = {"Token" : this.$store.state.token};
                let configuracion   = {headers : header};            
                axios.get('Api/Cliente/SelectCliente', configuracion).then(function (response){
                    clienteArray = response.data;
                    clienteArray.map(function(x){
                        me.cliente.push({ text:x.cNombre, value:x.idCliente });
                    });
                }).catch(function(error){
                    console.log(error);
                });
            },
            selectTipoComprobante(){
                let me              = this;
                let TipoCompArray   = [];
                let header          = {"Token" : this.$store.state.token};
                let configuracion   = {headers : header};            
                axios.get('Api/Tipo/ListarTipoComp', configuracion).then(function (response){
                    TipoCompArray = response.data;
                    TipoCompArray.map(function(x){
                        me.TipoComprobante.push({ text:x.cTipoComprobante, value:x.idTipoComprobante });
                    });
                }).catch(function(error){
                    console.log(error);
                });
            },
            buscarCodigo(){
                let me              = this;
                me.errorArticulo    = null;
                let header          = {"Token" : this.$store.state.token};
                let configuracion   = {headers : header};            
                axios.get('Api/Producto/BuscarCodigoVenta/' + this.codigo, configuracion).then(function (response){
                    me.agregarDetalle(response.data);
                }).catch(function(error){
                    me.errorArticulo='No existe el producto.';
                });

            },
            agregarDetalle(data){
                this.errorArticulo = null;
                if (this.encuentra(data.idProducto) == true){
                    this.errorArticulo = 'El producto ya ha sido agregado.';
                }
                else{
                    this.detalles.push(
                        {
                            idProducto  : data.idProducto,
                            cProducto   : data.cProducto,
                            nCantidad   : 1,
                            nPrecio     : parseInt(data.cPrecioProd),
                            nDescuento  : 0
                        }
                    );
                    this.codigo='';
                }
                
            },
            encuentra(id){
                let sw = 0;
                for (var i = 0; i< this.detalles.length; i++){
                    if(this.detalles[i].idVenta == id){
                        sw = true;
                    }
                }
                return sw;
            },
            eliminarDetalle(arr, item){
                let i = arr.indexOf(item);
                if (i!= -1){
                    arr.splice(i, 1);
                }
            },
            listarProducto(){
                let me              = this;
                let header          = {"Token" : this.$store.state.token};
                let configuracion   = {headers : header};            
                axios.get('Api/Producto/ListarVenta/' + this.texto, configuracion).then(function (response){
                    me.Productos = response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },
            mostrarModalArticulos(){
                this.dialog = 1;
            },
            listarDetalles(id){
                let me              = this;
                let header          = {"Token" : this.$store.state.token};
                let configuracion   = {headers : header};
                axios.get('Api/Venta/ListarDetalles/' + id, configuracion).then(function (response){
                    me.detalles = response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },
            verIngreso(item){
                this.limpiar();
                this.idTipoComprobante  = item.idTipoComprobante;
                this.cSerieComprobante  = item.cSerieComprobante;
                this.cNumComprobante    = item.cNumComprobante;
                this.idCliente          = item.idCliente;
                this.nImpuesto          = item.nImpuesto;
                this.verNuevo           = 1;
                this.verDetalle         = 1;
                this.listarDetalles(item.idVenta);
            },
            listar(){
                let me              = this;
                let header          = {"Token" : this.$store.state.token};
                let configuracion   = {headers : header};            
                axios.get('Api/Venta/Listar', configuracion).then(function (response){
                    me.ventas = response.data;
                }).catch(function(error){
                    console.log(error);
                });

            },
            limpiar(){
                this.idVenta            = '';
                this.idTipoComprobante  = '';
                this.cSerieComprobante  = '';
                this.cNumComprobante    = '';
                this.nImpuesto          = 0.18;
                this.codigo             = '';
                this.nTotal             = 0;
                this.nTotalParcial      = 0;
                this.nTotalImpuesto     = 0;
                this.detalles           = [];
                this.verNuevo           = 0;
                this.valida             = 0;
                this.validaMensaje      = [];
                this.verDetalle         = 0;
                this.idCliente          = '';
                this.editable           = false;
            },
            validar(){
                this.valida = 0;
                this.validaMensaje = [];
                if(!this.idCliente){
                    this.validaMensaje.push('Seleccione un cliente.');
                }
                if(!this.idTipoComprobante){
                    this.validaMensaje.push('Seleccione un tipo de comprobante.');
                }
                if(!this.cNumComprobante){
                    this.validaMensaje.push('Ingrese el número del comprobante.');
                }
                if(!this.nImpuesto || this.nImpuesto < 0 || this.nImpuesto > 1){
                    this.validaMensaje.push('Ingrese un impuesto válido.');
                }
                if(this.detalles.length <= 0){
                    this.validaMensaje.push('Ingrese al menos un producto al detalle');
                }
                if (this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            mostrarNuevo(){
                this.verNuevo = 1;
                this.editable = !this.editable;
            },
            ocultarNuevo(){
                this.verNuevo = 0;
                this.limpiar();
            },
            guardar(){
                let me              = this;
                let header          = {"Token" : this.$store.state.token};
                let configuracion   = {headers : header};
                if (this.validar()){
                    return;
                }
                //Código para guardar
                axios.post('Api/Venta/Crear',
                {
                    'idCliente'         : this.idCliente,
                    'idUsuario'         : 1,
                    'idTipoComprobante' : this.idTipoComprobante,
                    'cSerieComprobante' : this.cSerieComprobante,
                    'cNumComprobante'   : this.cNumComprobante,
                    'nImpuesto'         : this.nImpuesto,
                    'nTotal'            : parseFloat(this.nTotalImp),
                    'detalles'          : this.detalles
                },configuracion)
                .then(function(response){
                    me.limpiar();
                    me.close();
                    me.listar();
                })
                .catch(function(error){
                    console.log(error);
                });
            },
            activarDesactivarMostrar(accion,item){
                this.adModal    = 1;
                this.adNombre   = item.cNumComprobante;
                this.adId       = item.idVenta;
                if (accion == 1){
                    this.adAccion = 1;
                } else if(accion == 2){
                    this.adAccion = 2;
                } else{
                    this.adModal = 0;
                }
            },
            activarDesactivarCerrar(){
                this.adModal = 0;
            },
            activar(){
                let me              = this;
                let header          = {"Token" : this.$store.state.token};
                let configuracion   = {headers : header};
                axios.put('Api/Venta/Activar/' + this.adId, {},configuracion)
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
                let me              = this;
                let header          = {"Token" : this.$store.state.token};
                let configuracion   = {headers : header};
                console.log(this.adId);
                axios.put('Api/Venta/Anular/' + this.adId, {},configuracion)
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
            }
        }
    }
</script>

<style>
    #factura {
        padding: 20px;
        font-family: Arial, sans-serif;
        font-size: 16px ;
        text-align: left;
        border-top-width: 10px;
    }
    #logo {
        float: left;
        margin-left: 2%;
        margin-right: 2%;
    }
    #imagen {
        width: 40%;
    }
    #fact {
        font-size: 20px;
        font-weight: bold;
        text-align: right;
    }   
    #datos {
        float: left;
        margin-top: 0%;
        margin-left: 2%;
        margin-right: 2%;
    }
    #encabezado {
        margin-left: 10px;
        margin-right: 10px;
        font-size: 12px;
    }
    section {
        clear: left;
    }
    #cliente {
        text-align: left;
        border-spacing: 12px;
    }
    #facliente {
        width: 40%;
        border-collapse: collapse;
        border-spacing: 0;
        margin-bottom: 15px;
    }
    #fa {
        color: #FFFFFF;
        font-size: 14px;
    }
    #facarticulo {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        padding: 20px;
        margin-bottom: 15px;
    }
    #titulo2 {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        padding: 20px;
        margin-bottom: 15px;
    }
    #totalLetras {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        padding: 20px;
        margin-bottom: 15px;
        margin-top: 20px;
    }
    #facarticulo thead {
        padding: 20px;
        background: #2980BA;
        text-align: center;
        
    }
    #gracias {
        text-align: left;
    }
    #incab{
        color: hsl(0, 100%, 3%);
        font-size: 14px;
    }
    #verticalLine {
       height: 100%;
        width: 1px;
        border-left: 1px solid gray;
    }
    #TablaBorde {
        background: #ECEFF1;
        font-weight: bold;
    }
    #letra{
        font-weight: bold;
    }
    #titulo3 {
        font-size: 30px;
        font-weight: bold;
        line-height: 1.1;
        padding-left: 10px;
        padding-right: 10px;
    }
    #titulo4 {
        font-weight: bold;
    }
    #tabla{
        width: 100%;
    }
</style>