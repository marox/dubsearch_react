window.onload = function() {

var tl = new TimelineMax();
tl.add( TweenLite.to("body", 3, {backgroundColor:"#bbb3d9"}) );
tl.add( TweenLite.to("body", 3, {backgroundColor:"#f6c1da"}) );
tl.add( TweenLite.to("body", 3, {backgroundColor:"#f9b770"}) );
tl.add( TweenLite.to("body", 3, {backgroundColor:"#ffde88"}) );
tl.add( TweenLite.to("body", 3, {backgroundColor:"#bfd98f"}) );
tl.add( TweenLite.to("body", 3, {backgroundColor:"#b6e1f7"}) );
tl.add( TweenLite.to("body", 3, {backgroundColor:"#bbb3d9"}) );

tl.repeat(-1);

}