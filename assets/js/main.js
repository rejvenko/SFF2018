/*
	Hyperspace by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {
  var resizeTimer;
  var $window = $(window),
    $body = $('body'),
    $sidebar = $('#sidebar');

  updateSectionHeight();

  // Breakpoints.
  breakpoints({
    xlarge: ['1281px', '1680px'],
    large: ['981px', '1280px'],
    medium: ['737px', '980px'],
    small: ['481px', '736px'],
    xsmall: [null, '480px']
  });

  // Hack: Enable IE flexbox workarounds.
  if (browser.name == 'ie')
    $body.addClass('is-ie');

  // Play initial animations on page load.
  $window.on('load', function () {
    window.setTimeout(function () {
      $body.removeClass('is-preload');
    }, 100);
  });

  // Forms.

  // Hack: Activate non-input submits.
  $('form').on('click', '.submit', function (event) {

    // Stop propagation, default.
    event.stopPropagation();
    event.preventDefault();

    // Submit form.
    $(this).parents('form').submit();

  });

  // Sidebar.
  if ($sidebar.length > 0) {

    var $sidebar_nav = $('#sidebar nav');
    var $sidebar_a = $sidebar_nav.find('a');

    $sidebar_a
      .addClass('scrolly')
      .on('click', function () {

        var $this = $(this);

        // External link? Bail.
        if ($this.attr('href').charAt(0) != '#')
          return;

        // Deactivate all links.
        $sidebar_a.removeClass('active');

        // Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
        $this
          .addClass('active')
          .addClass('active-locked');

      })
      .each(function () {

        var $this = $(this),
          id = $this.attr('href'),
          $section = $(id);

        // No section for this link? Bail.
        if ($section.length < 1)
          return;

        // Scrollex.
        $section.scrollex({
          mode: 'middle',
          top: '-20vh',
          bottom: '-20vh',
          initialize: function () {

            // Deactivate section.
            $section.addClass('inactive');

          },
          enter: function () {

            // Activate section.
            $section.removeClass('inactive');

            // No locked links? Deactivate all links and activate this section's one.
            if ($sidebar_a.filter('.active-locked').length == 0) {

              $sidebar_a.removeClass('active');
              $this.addClass('active');

            }

            // Otherwise, if this section's link is the one that's locked, unlock it.
            else if ($this.hasClass('active-locked'))
              $this.removeClass('active-locked');

          }
        });

      });

  }

  // Scrolly.
  $('.scrolly').scrolly({
    speed: 1000,
    offset: function () {

      // If <=large, >small, and sidebar is present, use its height as the offset.
      if (breakpoints.active('<=large')
        && !breakpoints.active('<=small')
        && $sidebar.length > 0)
        return $sidebar.height();

      return 0;

    }
  });

  // Spotlights.
  $('.spotlights > section')
    .scrollex({
      mode: 'middle',
      top: '-10vh',
      bottom: '-10vh',
      initialize: function () {

        // Deactivate section.
        $(this).addClass('inactive');

      },
      enter: function () {

        // Activate section.
        $(this).removeClass('inactive');

      }
    })
    .each(function () {

      var $this = $(this),
        $image = $this.find('.image'),
        $img = $image.find('img'),
        x;

      // Assign image.
      $image.css('background-image', 'url(' + $img.attr('src') + ')');

      // Set background position.
      if (x = $img.data('position'))
        $image.css('background-position', x);

      // Hide <img>.
      $img.hide();

    });

  // Features.
  $('.features')
    .scrollex({
      mode: 'middle',
      top: '-20vh',
      bottom: '-20vh',
      initialize: function () {

        // Deactivate section.
        $(this).addClass('inactive');

      },
      enter: function () {

        // Activate section.
        $(this).removeClass('inactive');

      }
    });


  $('.navbar-nav a').click(function () {
    closeNavbar();
  });
  
  // Sections min height
  window.onresize = function (event) {
    clearInterval(resizeTimer);

    resizeTimer = setTimeout(function () {
      updateSectionHeight();
    }, 250);
  };

  $('#files').change(function (e) {
    if (check_file_upload() == false) {
      var msg = 'Fajl koji ste izabrali nije uredu. Video fajl moze biti maksimalne velicine 150mb.'
      error_handler(msg, '#name');
      return;
    }
  })

})(jQuery);

$('#submit_form').click(function (e) {
  e.preventDefault();
  e.stopPropagation();

  // get fields
  var form = $(forma);
  var data = $(form).serializeArray();

  window.data = data;
  var fields = getFields(data);

  // validate fields

  var pravila = $('input#prihvatam_pravila').is(':checked');

  if (fields.name.value.length <= 2 || fields.name.length > 50) {
    var msg = 'Ime nije unešeno ili je prekratko/predugačko.';
    error_handler(msg, '#name');
    return;
  } else if (fields.surname.value.length <= 2 || fields.surname.length > 50) {
    var msg = 'Prezime nije unešeno ili je prekratko/predugacko.';
    error_handler(msg, '#surname');
    return;
  } else if (fields.country.value == '') {
    var msg = 'Molimo izaberite državu.';
    error_handler(msg, '#country');
    return;
  } else if (fields.email.value.length <= 7 || fields.email.value.indexOf('@') == -1) {
    var msg = 'Email nije unešen ili nije validan.';
    error_handler(msg, '#email');
    return;
  } else if (check_file_upload() !== true) {
    var msg = 'Video fajl koji ste odabrali nije odgovarajuće veličine.';
    error_handler(msg, '#files');
    return;
  } else if (pravila !== true) {
    var msg = 'Da bi ste nastavili prihvatite pravila korišćenja.';
    error_handler(msg, '#prihvatam_pravila');
    return;
  }

  prepareForm();
  $('#forma').submit();
});

function onSuccess() {
  $('#forma').trigger("reset").hide();
  $('.progress').hide();

  error_handler('Video fajl je uspešno uploadovan.');
}

function prepareForm() {
  var bar = $('#bar');
  var percent = $('#percent');

  $('#forma').ajaxForm({
    beforeSubmit: function () {
      document.getElementById("progress_div").style.display = "block";
      var percentVal = '0%';
      bar.width(percentVal);
      percent.html(percentVal);
    },

    uploadProgress: function (event, position, total, percentComplete) {
      var percentVal = percentComplete + '%';
      console.log(percentVal);
      $('.progress .percent').text(percentVal);
      $('.progress .bar').width(percentVal);
      // $(bar).width(percentVal);
      // $(percent).text(percentVal);
    },

    success: function () {
      var percentVal = '100%';
      bar.width(percentVal);
      percent.html(percentVal);
    },

    complete: function (xhr) {
      if (xhr.responseText === 'success') {
        onSuccess();
      } else {
        error_handler(xhr.responseText);
      }
    }
  });
}

var sff_max_file_size = 157286400;

// var sff_max_file_size = 1073741824;

function check_file_upload() {
  var elem = $('#files');
  var files = $(elem)[0].files;

  if (files.length != 1) {
    return false;
  }

  var filesize = files[0].size;

  if (filesize > sff_max_file_size) {
    return false;
  }

  return true;
}

function error_handler(msg, element) {
  $('.form-message').text(msg);
  console.error(msg);
  if (typeof element != 'undefined') {
    $(element).focus();
  }
}

function updateSectionHeight(height) {

  if (typeof height === 'undefined') {
    height = $(window).innerHeight();
  }

  $('#wrapper > section').css('minHeight', height + 'px');

  if (height > 500) {
    $('#ofilmu').css('height', height + 'px');
  }
}

function getFields(data) {
  var val = [];

  data.forEach(function (field) {
    val[field.name] = field;
  })

  return val;
}

function closeNavbar() {
  var button = $('.navbar-toggler');
  var navbar = $('.navbar-collapse');

  $(button).addClass('collapsed').attr('aria-expanded', false);;
  $(navbar).removeClass('show').attr('aria-expanded', false);
}