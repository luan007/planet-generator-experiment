
	
	uniform sampler2D tDiffuse;
	uniform vec2 resolution;
	varying vec2 vUv;
	
	void main(void) {
	
		vec2 p = gl_FragCoord.xy / resolution.xy;
		vec2 d = .5 - p;
		float distance = 2.0 * length( d );

		vec3 color = texture2D( tDiffuse, vec2( distance, 0.0 ) ).rgb;

		gl_FragColor = vec4( color, 1.0 );
		
	}
	
	