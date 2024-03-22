var c_tokens = [25, 67, 23, 78, 11, 67, 90, 18, 31, 18, 25, 87, 25, 71];

function Crypter() {

};

Crypter.Uint8ToString = function (u8a) {
    var CHUNK_SZ = 0x8000;
    var c = [];
    for (var i = 0; i < u8a.length; i += CHUNK_SZ) {
        c.push(String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)));
    }
    return c.join("");
};

Crypter.convertDataURIToBinary = function(dataURI) { 
    var base64 = dataURI;
    var raw = "";
    try {
        raw = Crypter.atob(base64);
    }
    catch (e) {
        raw = dataURI;
    }
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
    for (i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }
    return array;
};

Crypter.cryptoGimmicksDo = function (textSource) {
    //return textSource; //no encryption
    var sourceLength = textSource.length
    var uInt8Array = new Uint8Array(sourceLength); //non unicode 1 byte per char, use decodeURI(), encodeURI() for unicode support?
    for (var i = 0; i < sourceLength; i++) {
        var code = textSource.charCodeAt(i);
        uInt8Array[i] = code;
    }
    for (var j = 0; j < uInt8Array.length; j++) {
        uInt8Array[j] = uInt8Array[j] ^ c_tokens[j % (c_tokens.length)];
    }
    var encryptedBase64 = Crypter.btoa(String.fromCharCode.apply(null, uInt8Array)); //btoa is not defined on android, encryption temporary disabled TODO:fix
    return encryptedBase64;
};

Crypter.cryptoGimmicksUndo = function (encryptedBase64) {
    //return encryptedBase64; //no encryption
    var uInt8Array = Crypter.convertDataURIToBinary(encryptedBase64);
    for (var j = 0; j < uInt8Array.length; j++) {
        uInt8Array[j] = uInt8Array[j] ^ c_tokens[j % (c_tokens.length)];
    }
    var textSource = Crypter.Uint8ToString(uInt8Array);
    return textSource;
};


;(function () {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  
    function InvalidCharacterError(message) {
      this.message = message;
    }
    InvalidCharacterError.prototype = new Error;
    InvalidCharacterError.prototype.name = 'InvalidCharacterError';
  
    // encoder
    // [https://gist.github.com/999166] by [https://github.com/nignag]
    Crypter.btoa = function (input) {
      var str = String(input);
      for (
        // initialize result and counter
        var block, charCode, idx = 0, map = chars, output = '';
        // if the next str index does not exist:
        //   change the mapping table to "="
        //   check if d has no fractional digits
        str.charAt(idx | 0) || (map = '=', idx % 1);
        // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
        output += map.charAt(63 & block >> 8 - idx % 1 * 8)
      ) {
        charCode = str.charCodeAt(idx += 3/4);
        if (charCode > 0xFF) {
          throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
        }
        block = block << 8 | charCode;
      }
      return output;
    };
  
    // decoder
    // [https://gist.github.com/1020396] by [https://github.com/atk]
    Crypter.atob = function (input) {
      var str = String(input).replace(/=+$/, '');
      if (str.length % 4 == 1) {
        throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
      }
      for (
        // initialize result and counters
        var bc = 0, bs, buffer, idx = 0, output = '';
        // get next character
        buffer = str.charAt(idx++);
        // character found in table? initialize bit storage and add its ascii value;
        ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
          // and if not first of each 4 characters,
          // convert the first 8 bits to one ascii character
          bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
      ) {
        // try to find character in table (0-63, not found => -1)
        buffer = chars.indexOf(buffer);
      }
      return output;
    };
  }());