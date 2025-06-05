var input = document.getElementById('autocomplete-filter');
new Awesomplete(input, {
  list: AutocompleteList,
  replace: function(item) {
    this.input.value = item.label;
  },
  sort: function(a, b) {
    var name_a = a.label.toUpperCase();
    var name_b = b.label.toUpperCase();
    if ( name_a < name_b ) {
      return -1;
    }
    if ( name_b < name_a ) {
      return 1;
    }
    return 0;
  }
});
input.addEventListener('awesomplete-select', function(event) {
  document.location = document.location.origin + event.text.value;
});
