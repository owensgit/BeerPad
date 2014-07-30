var args = arguments[0] || {};

console.log(args);

if (args.beer_image) {
    $.image.image = args.beer_image;
}

$.name.text = args.name.toUpperCase();
$.brewery.text = utils.buildBreweryAndPercentString(args.brewery, args.percent);


if (args.notes) {
    $.notes.text = args.notes;
}
