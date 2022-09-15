// 要素の値を空する
function toEmpty(array) {  
  $.each(array, function(index, val) {
    $(val).html('');
  }); 
};

// バリデーション関数
function validateZipcode(name, require=false) {
  let error = '';
  
  if (require) {
     if(name === "") {
       error = '必須項目です。';
       return error;
     };
  };
 

  if(!(/^[0-9]{3}-?[0-9]{4}$/.test(name))) {
    error = '正しい郵便番号形式で入力してください。';
  };
  return error;
};

// 郵便番号を取得して住所を返す
function searchAddress(param) {
  return $.ajax({
    type: "GET",
    cache: false,
    data: param,
    url: 'https://zipcloud.ibsnet.co.jp/api/search',
    dataType: 'jsonp',
  });
};

// 検索ボタンクリック時の処理
$(function () {  
  $('.searchBtn').click(function () {
      let toEmptyArray = ['#zip_error', '#address1', '#address2', '#address3'];
      // toEmpty(配列)
      toEmpty(toEmptyArray);
      
      let zipcode = $('#zipcode').val();
      // validation(バリデーションしたい要素の値, 必須かどうか(true or false))
      let error = validateZipcode(zipcode, true);
      if (error) {
        $('#zip_error').html(error);
        return;
      }
    
      let param = 
      {
        zipcode: zipcode,
        limit: 1
      };
      
      searchAddress(param).done((data) => {
         if (data.status == 200 && $.isArray(data.results)) {           
           let n = 1;
           
           $.each(data.results[0], function(index, value) {
             if (index === 'address1' || index === 'address2' || index === 'address3') {
                $('#address' + String(n)).html(value);
             }  
             n = n + 1;
           })
         } else {
           $('#zip_error').html('住所を取得できませんでした');
         }
      }).fail((jqXHR, textStatus, errorThrown) => {
          alert(errorThrown);
      });

  });
});
