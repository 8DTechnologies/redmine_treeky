// Generated by CoffeeScript 1.6.3
(function() {
  $(function() {
    var expandFavorite, expandRegular, numOfFavProjects;
    $('span.expander').on('click', function(event) {
      if ($('#only-favorite-projects').hasClass('all')) {
        return $(this).trigger('clickRegular');
      } else {
        return $(this).trigger('clickFavorite');
      }
    });
    expandRegular = function(event) {
      if ($(this).parents('tr').hasClass('open')) {
        $(this).collapseExpander();
      } else {
        $(this).expandExpander();
      }
      return $('table').redrawTableStrip();
    };
    expandFavorite = function(event) {
      if ($(this).parents('tr').hasClass('open')) {
        $(this).collapseExpander({
          favorite: true
        });
      } else {
        $(this).expandExpander({
          favorite: true
        });
      }
      return $('table').redrawTableStrip();
    };
    $.fn.collapseExpander = function(options) {
      var $tr, defaults, fav, projectId, settings;
      defaults = {
        favorite: false,
        bubbling: false
      };
      settings = $.extend({}, defaults, options);
      $tr = this.parents('tr');
      $tr.removeClass('open').addClass('closed');
      if ($tr.isParent()) {
        projectId = $tr.getProjectId();
        fav = settings.favorite ? ".fav" : "";
        if (!settings.bubbling) {
          return $("tr:visible." + projectId + fav).hide();
        }
      }
    };
    $.fn.expandExpander = function(options) {
      var $tr, defaults, fav, parentLevel, projectId, settings;
      defaults = {
        favorite: false,
        bubbling: false
      };
      settings = $.extend({}, defaults, options);
      $tr = this.parents('tr');
      if (!$tr.hasClass('open')) {
        $tr.removeClass('closed').addClass('open');
      }
      projectId = $tr.getProjectId();
      parentLevel = $tr.getProjectLevel();
      fav = settings.favorite ? ".fav" : "";
      return $("tr:hidden." + projectId + fav + "[data-project-level=" + (parentLevel + 1) + "]").each(function() {
        if ($(this).isParent() && $(this).hasClass('open')) {
          $(this).find('span.expander').expandExpander(options);
        }
        return $(this).show();
      });
    };
    $('tbody tr form').on('ajax:success', function(evt, data, status, xhr) {
      var $parentProjectTr, $submitType, $tr;
      $tr = $(this).parents('tr');
      $submitType = $(this).find('input[name="_method"]');
      if ($tr.hasClass('fav')) {
        if ($('#only-favorite-projects').hasClass('fav')) {
          $tr.hide();
          if ($tr.hasParentProject()) {
            $parentProjectTr = $tr.parentProjectTr();
          }
          if (($parentProjectTr != null) && !$parentProjectTr.hasVisibleChildProject(true)) {
            $parentProjectTr.find('span.expander').off('clickFavorite').addClass('dummy');
          }
        }
        $tr.removeClass('fav').addClass('unfav');
        $(this).find('input[type="submit"]').removeClass('fav').addClass('unfav');
        if ($submitType != null) {
          $submitType.attr('value', 'post');
        }
        if ($tr.isParent()) {
          return $(this).parents("tr").tagChildren($tr.getProjectLevel());
        }
      } else if ($tr.hasClass('unfav')) {
        $tr.removeClass('unfav').addClass('fav');
        if (!$submitType.exists()) {
          $submitType = $('<input>').attr('name', '_method').attr('type', 'hidden');
          $(this).prepend($submitType);
        }
        $submitType.attr('value', 'delete');
        $(this).find('input[type="submit"]').removeClass('unfav').addClass('fav');
        return $(this).tagParent();
      }
    }).bind('ajax:failure', function(evt, data, status, xhr) {
      return console.log("Something went horribly wrong. And it's all Charles' faults");
    });
    $.fn.getProjectLevel = function() {
      return this.data('project-level');
    };
    $.fn.getProjectId = function() {
      return this.data('project-id');
    };
    $.fn.fav = function() {
      return this.removeClass('unfav').addClass('fav');
    };
    $.fn.unfav = function() {
      return this.removeClass('fav').addClass('unfav');
    };
    $.fn.isFav = function() {
      return this.hasClass('fav');
    };
    $.fn.isUnfav = function() {
      return this.hasClass('unfav');
    };
    $.fn.isParent = function() {
      if (this.hasClass('parent')) {
        return true;
      }
      if (this.parents('tr').hasClass('parent')) {
        return true;
      }
      return false;
    };
    $.fn.hasParentProject = function() {
      return this.data('project-level') > 0;
    };
    $.fn.parentProjectTr = function() {
      var closestParentId, parentIds;
      parentIds = this.attr('class').match(/[\d]+/g);
      if (parentIds == null) {
        return void 0;
      }
      closestParentId = parentIds.reverse()[0];
      return $("tr#" + closestParentId + "span");
    };
    $.fn.tagChildren = function(level) {
      var els, projectId;
      projectId = this.getProjectId();
      els = $.grep($("tr.fav." + projectId), function(el) {
        return $(el).getProjectLevel() === level + 1;
      });
      return $.each(els, function(index, el) {
        if ($(this).isFav()) {
          return $(el).find('form').submit();
        }
      });
    };
    $.fn.tagParent = function() {
      var $el, closestUnfavParents, klazz, parents;
      $el = this;
      klazz = $el.parents('tr').attr('class');
      parents = klazz.match(/[\d]+/g);
      if (parents) {
        closestUnfavParents = $.grep(parents.reverse(), function(parentId, index) {
          $el = $("tr.unfav#" + parentId + "span");
          return $el.exists();
        });
        if (closestUnfavParents.length > 0) {
          return $("tr.unfav#" + closestUnfavParents[0] + "span").find('form').submit();
        }
      }
    };
    $.fn.exists = function() {
      return this.length !== 0;
    };
    $('.project-custom-label-filter').change(function(e) {
      $(this).find('input[type=checkbox]').each(function() {
        var $td, classId;
        classId = $(this).data('field');
        $td = $("#projects-list .custom-field-" + classId);
        if ($(this).is(':checked')) {
          return $td.css("display", "");
        } else {
          return $td.css("display", "none");
        }
      });
      return $(this).submit();
    });
    $('#collapse-expand-all-projects').on('click', function(e) {
      var $anchor;
      e.preventDefault();
      $anchor = $(this);
      if ($anchor.hasClass('expanded')) {
        $anchor.addClass('collapsed').removeClass('expanded');
        $('tr.parent.open span.expander').each(function() {
          return $(this).collapseExpander();
        });
        $anchor.html("Expand all");
      } else if ($anchor.hasClass('collapsed')) {
        $anchor.addClass('expanded').removeClass('collapsed');
        $('tr.parent.closed span.expander').each(function() {
          return $(this).expandExpander();
        });
        $anchor.html("Collapse all");
      }
      return $('table').redrawTableStrip();
    });
    $('#only-favorite-projects').on('click', function(e) {
      var $anchor, $collapse;
      e.preventDefault();
      $anchor = $(this);
      if ($anchor.hasClass('all')) {
        $collapse = $('#collapse-expand-all-projects');
        if ($collapse.hasClass('collapsed')) {
          $collapse.trigger('click');
        }
        $('span.expander').off('clickRegular');
        $('span.expander').on('clickFavorite', expandFavorite);
        $anchor.removeClass('all').addClass('fav');
        $anchor.html("Show all projects");
        $('#collapse-expand-all-projects').hide();
        $('#projects-list tbody tr').each(function() {
          if ($(this).hasClass('fav')) {
            $(this).show();
          } else {
            $(this).hide();
          }
          if ($(this).hasClass('parent')) {
            $(this).addClass('open').removeClass('closed');
            if (!$(this).hasVisibleChildProject(true)) {
              return $(this).find('span.expander').off('clickFavorite').addClass('dummy');
            }
          }
        });
      } else if ($anchor.hasClass('fav')) {
        $('span.expander').off('clickFavorite');
        $('span.expander').on('clickRegular', expandRegular);
        $anchor.removeClass('fav').addClass('all');
        $anchor.html("Only favorites");
        $('#collapse-expand-all-projects').show();
        $('#projects-list tbody tr').each(function() {
          $(this).show();
          if ($(this).isParent()) {
            $(this).addClass('open').removeClass('closed');
            return $(this).find('span.expander').removeClass('dummy');
          }
        });
        $('#collapse-expand-all-projects').html("Collapse all");
        $('#collapse-expand-all-projects').removeClass('collapsed').addClass('expanded');
      }
      return $('table').redrawTableStrip();
    });
    $.fn.hasVisibleChildProject = function(favorite) {
      var fav, projectId, projectLevel;
      if (favorite == null) {
        favorite = false;
      }
      fav = favorite ? ".fav" : "";
      projectId = this.data('project-id');
      projectLevel = this.data('project-level');
      return $("tr:visible." + projectId + fav + "[data-project-level=" + (projectLevel + 1) + "]").exists();
    };
    $.fn.redrawTableStrip = function() {
      var alt;
      alt = 1;
      return this.find('tbody tr:visible').each(function() {
        var klass;
        $(this).removeClass('even odd');
        klass = ((alt++) % 2) === 0 ? "even" : "odd";
        return $(this).addClass(klass);
      });
    };
    $('span.expander').click(expandRegular);
    numOfFavProjects = $('tr.fav').length;
    if (numOfFavProjects > 0) {
      $('#only-favorite-projects').trigger('click');
    }
    return $('.project-custom-label-filter').trigger('change');
  });

}).call(this);
