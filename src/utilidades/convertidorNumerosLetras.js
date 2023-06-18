function convertidorNumerosLetras(num) {
    console.log(123334);
    let data = {
      numero: num,
      enteros: Math.floor(num),
      centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
      letrasCentavos: '',
      letrasMonedaPlural: 'CON 00/100 SOLES',
      letrasMonedaSingular: 'SOL',
      letrasMonedaCentavoPlural: 'CENTAVOS',
      letrasMonedaCentavoSingular: 'CENTAVO'
    };
  
    if (data.centavos > 0) {
      data.letrasCentavos = 'CON ' + (function () {
        if (data.centavos == 1) {
        } else {
          return millones(data.centavos) + ' ' + data.letrasMonedaCentavoPlural;
        }
      })();
    }
  
    if (data.enteros == 0) {
      return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
    }
    if (data.enteros == 1) {
      return millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
    } else {
      return millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
    }
  }
  
  function millones(num) {
    let divisor = 1000000;
    let cientos = Math.floor(num / divisor);
    let resto = num - (cientos * divisor);
  
    let strMillones = seccion(num, divisor, 'UN MILLON DE', 'MILLONES');
    let strMiles = miles(resto);
  
    if (strMillones === '') {
      return strMiles;
    }
    return strMillones + ' ' + strMiles;
  }
  
  function seccion(num, divisor, strSingular, strPlural) {
    let cientos = Math.floor(num / divisor);
    let resto = num - (cientos * divisor);
  
    let letras = '';
  
    if (cientos > 0) {
      if (cientos > 1) {
        letras = centenas(cientos) + ' ' + strPlural;
      } else {
        letras = strPlural;
      }
    }
  
    if (resto > 0) {
      letras += '';
    }
  
    return letras;
  }
  
  function miles(num) {
    let divisor = 1000;
    let cientos = Math.floor(num / divisor);
    let resto = num - (cientos * divisor);
  
    let strMiles = seccion(num, divisor, 'UN MIL', 'MIL');
    let strCentenas = obtenerCentenas(resto);
  
    if (strMiles === '') {
      return strCentenas;
    }
  
    return strMiles + ' ' + strCentenas;
  }
  
  function obtenerCentenas(num) {
    let centenas = Math.floor(num / 100);
    let decenas = num - (centenas * 100);
  
    switch (centenas) {
      case 1:
        if (decenas > 0) {
          return 'CIENTO ' + obtenerDecenas(decenas);
        }
        return 'CIEN';
      case 2: return 'DOSCIENTOS ' + obtenerDecenas(decenas);
      case 3: return 'TRESCIENTOS ' + obtenerDecenas(decenas);
      case 4: return 'CUATROCIENTOS ' + obtenerDecenas(decenas);
      case 5: return 'QUINIENTOS ' + obtenerDecenas(decenas);
      case 6: return 'SEISCIENTOS ' + obtenerDecenas(decenas);
      case 7: return 'SETECIENTOS ' + obtenerDecenas(decenas);
      case 8: return 'OCHOCIENTOS ' + obtenerDecenas(decenas);
      case 9: return 'NOVECIENTOS ' + obtenerDecenas(decenas);
    }
    return obtenerDecenas(decenas);
  }
  
  function obtenerDecenas(num) {
    let decena = Math.floor(num / 10);
    let unidad = num - (decena * 10);
    switch (decena) {
      case 1:
        switch (unidad) {
          case 0: return 'DIEZ';
          case 1: return 'ONCE';
          case 2: return 'DOCE';
          case 3: return 'TRECE';
          case 4: return 'CATORCE';
          case 5: return 'QUINCE';
          default: return 'DIECI' + obtenerUnidades(unidad);
        }
      case 2: switch (unidad) {
        case 0: return 'VEINTE';
        default: return 'VEINTI' + obtenerUnidades(unidad);
      }
      case 3: return decenasY('TREINTA', unidad);
      case 4: return decenasY('CUARENTA', unidad);
      case 5: return decenasY('CINCUENTA', unidad);
      case 6: return decenasY('SESENTA', unidad);
      case 7: return decenasY('SETENTA', unidad);
      case 8: return decenasY('OCHENTA', unidad);
      case 9: return decenasY('NOVENTA', unidad);
      case 0: return obtenerUnidades(unidad);
    }
  }
  
  function decenasY(strSin, numUnidades) {
    if (numUnidades > 0) {
      return strSin + ' Y ' + obtenerUnidades(numUnidades);
    }
    return strSin;
  }
  
  function obtenerUnidades(num) {
    switch (num) {
      case 1: return 'UNO';
      case 2: return 'DOS';
      case 3: return 'TRES';
      case 4: return 'CUATRO';
      case 5: return 'CINCO';
      case 6: return 'SEIS';
      case 7: return 'SIETE';
      case 8: return 'OCHO';
      case 9: return 'NUEVE';
    }
    return '';
  }
  
  export default convertidorNumerosLetras;
  