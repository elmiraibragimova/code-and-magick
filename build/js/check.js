var getMessage = function(a, b) {

	var i;

	if ( typeof a === 'boolean' ) {
		if (a) return 'Я попал в ' + b;

		return 'Я никуда не попал';
	}

	if( typeof a === 'number' ) {
		return 'Я прыгнул на ' + a * 100 + ' сантиметров';
	}

	if(a) {
		if(b) {

			var minLength = Math.min(a.length, b.length);
			var length = 0;

			for ( i = 0; i < minLength; i++ ) {
				length += a[i] * b[i];
			}

			return 'Я прошёл ' + length + ' метров';

		} else {
				var sum = 0;

				for (   i = 0; i < a.length; i++ ) {
					sum += a[i];
				}

				return 'Я прошёл ' + sum + ' шагов';
		}
	}
}
