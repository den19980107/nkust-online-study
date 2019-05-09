var Base = require('./'),
    test = require('tape');


test('basic extend', function(t) {
	var Foo = Base.extend();
	var foo = new Foo();

	t.ok(foo instanceof Foo, 'instance of subclass');
	t.ok(foo instanceof Base, 'instance of base class');

	t.end();
});
test('double extend', function(t) {
	var Foo = Base.extend();
	var Bar = Foo.extend();
	var bar = new Bar();

	t.ok(bar instanceof Bar, 'instance of subsubclass');
	t.ok(bar instanceof Foo, 'instance of subclass');
	t.ok(bar instanceof Base, 'instance of base class');

	t.end();
});
test('methods', function(t) {
	var Baz = Base.extend({
		quux: function() {
			t.ok(this instanceof Baz, 'context is right class');
			return 5;
		}
	}).meta({
		frob: function() {
			return 6;
		}
	});

	t.ok(new Baz().quux() === 5, 'methods work');
	t.ok(Baz.frob() === 6, 'static methods work');

	var Lorem = Baz.extend({
		ipsum: function() {
			return 7;
		}
	}).meta({
		dolor: function() {
			return 8;
		}
	});

	t.ok(new Lorem().quux() === 5, 'inherited methods work');
	t.ok(new Lorem().ipsum() === 7, 'inherited methods work');
	t.ok(Lorem.frob() === 6, 'inherited static methods work');
	t.ok(Lorem.dolor() === 8, 'inherited static methods work');

	var Sit = Baz.extend({
		quux: function quux() {
			return quux.super$.apply(this, arguments) + 1;
		}
	});

	t.ok(new Sit().quux() === 6, 'super$ calls work');

	t.end();
});
test('initializers', function(t) {
	var Init = Base.extend({
		initialize: function initialize(a) {
			this.a = a;
			t.ok(this instanceof Init, 'right context');
			t.ok(initialize.superclass$ === Base, 'superclass$ is set');
		}
	});
	t.ok(new Init(5).a === 5, 'initializer works');

	var Sub = Init.extend({
		initialize: function initialize(a) {
			initialize.super$.call(this,a * 2);
			t.ok(this instanceof Sub, 'right context');
			t.ok(initialize.superclass$ === Init, 'superclass$ is set');
		}
	});

	t.ok(new Sub(5).a === 10, 'inherited initializer works');

	var SubSub = Sub.extend({
		initialize: function initialize(a) {
			initialize.super$.call(this,a * 2);
			t.ok(initialize.superclass$ === Sub, 'superclass$ is set');
		}
	});

	t.ok(new SubSub(5).a === 20, 'double inherited initializer works');

	t.end();
});
test('external classes', function(t) {
	function External(a) {
		t.ok(this instanceof External, 'right context');
		this.a = a;
	}

	External.prototype.foo = function(b) {
		t.ok(this instanceof External, 'right context');
		return this.a * b;
	};

	External.prototype.bar = function(b) {
		t.ok(this instanceof External, 'right context');
		return this.a + b;
	};

	var ExternalSub = Base.extend.call(External, {
		foo: function foo(b) {
			return foo.super$(b + 2);
		}
	});
	var e = new ExternalSub(5);
	t.ok(e instanceof ExternalSub, 'instance of right class');
	t.ok(e instanceof External, 'instance of right class');
	t.ok(e.a === 5, 'initializer works');
	t.ok(e.bar(4) === 9, 'inherited method work');
	t.ok(e.foo(4) === 30, 'inherited method work');

	var ExternalSubSub = ExternalSub.extend({
		initialize: function initialize(a) {
			initialize.super$(a * 2);
		}
	});
	var es = new ExternalSubSub(5);
	t.ok(es.a === 10, 'initializer works');
	t.ok(es instanceof ExternalSubSub, 'instance of right class');
	t.ok(es instanceof ExternalSub, 'instance of right class');
	t.ok(es instanceof External, 'instance of right class');

	t.end();
});

test('bare constructors', function(t) {
	var Bare = Base.extend({
		initialize: function(a) {
			this.a = a;
		}
	});

	var b = Bare(5);
	t.ok(b instanceof Bare, 'bare constructors work');
	t.ok(b.a === 5, 'bare constructor initializers work');

	t.end();
});

test('non-function members', function(t) {
	var Members = Base.extend({
		a: 5
	});

	var b = Members();
	t.ok(b.a === 5, 'non-function members work');

	var MetaMembers = Base.extend({}).meta({
		a: 5
	});

	t.ok(MetaMembers.a === 5, 'non-function members work');

	t.end();
});
test('display name', function(t) {
	var Named = Base.extend('Named', {});
	
	t.ok(Named.displayName === 'Named', 'first argument as string sets the display name');

	t.end();
});
test('method properties', function(t) {
	var bar;
	var Foo = Base.extend({
		bar: (bar = function() {}, bar.baz = 'quux', bar)
	});

	t.ok((new Foo()).bar.baz === 'quux', 'method properties are kept');

	t.end();
});