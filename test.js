function f() {
    console.log("foo");
    setTimeout(g, 0);
    console.log("baz");
    h();
  }
  
  function g() {
    console.log("bar");
  }
  
  function h() {
    console.log("blix");
  }
  
  f();