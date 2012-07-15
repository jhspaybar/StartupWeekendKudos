function onLoad() {
}

function onLinkedInAuth() {
  // this must be the same domain as the application, where we write the cookie
  IN.API.Profile("me").result(function(result) {
    $.ajax({
      type: 'POST',
      url: '/linkin',
      data: {linkedInID: result.values[0].id,
             pictureUrl: result.values[0].pictureUrl}
    }).done(function(data) {
      window.location.replace('/profile');
    });
  });
}

function getCookie(allCookies, name) {
  var cookies = allCookies.split(';');
  for (var i = 0; i < cookies.length; i++) {
    var parts = cookies[i].split('=');
    if (parts[0].trim() === name) {
      return parts[1];
    }
  }
  return null;
}
