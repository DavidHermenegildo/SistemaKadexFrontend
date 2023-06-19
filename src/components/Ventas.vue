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
                            <v-btn @click="imprimirFormato" color="blue darken-1" style="color: white;"><v-icon>print</v-icon></v-btn>
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
                                                    <img src="data:image/webp;base64,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" id="imagen">
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
                                                            <label for="">: CAL.CALLE 09 MZA. G1 LOTE. 6 URB</label>
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
                                <!--br>
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
                                                    <qrcode :size="size" :cls="qrCls" :value="qrText"></!--qrcode>
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
                                </footer-->
                            </div>
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
                            <br>
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
                            <br>
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
    import html2canvas from 'html2canvas';
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
            imprimirFormato(){
                var quotes = document.getElementById('factura');
                html2canvas(quotes).then(function (canvas) {
                    var imgData     = canvas.toDataURL('image/png'); 
                    var imgWidth    = 210;
                    var pageHeight  = 295;
                    var imgHeight   = canvas.height * imgWidth / canvas.width;
                    var heightLeft  = imgHeight;
                    var doc         = new jsPDF();
                    var position    = 0;

                    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    doc.save('ComprobanteVenta.pdf');
                });
            },
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