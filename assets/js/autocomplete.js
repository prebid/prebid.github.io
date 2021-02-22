var input = document.getElementById('bidder-filter');
new Awesomplete(input, {
  list: BidderList,
  replace: function(item) {
    this.input.value = item.label;
  }
});
input.addEventListener('awesomplete-select', function(event) {
  document.location = document.location.origin + event.text.value;
});
