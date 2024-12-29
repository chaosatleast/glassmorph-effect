export const fragmentChunk1 = /* glsl */ `

    uniform vec3 u_Color;
    uniform float u_Intensity;
    uniform float u_Time;
    uniform vec2 u_Mouse;
    uniform vec2 u_Resolution;
    varying vec3 v_Normal;
    varying vec3 v_ViewDirection;
    varying vec2 v_Uv;


    float fresnelSchlick(float cosTheta, float F0) {
        return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
    }

    float perlinNoise(vec2 uv) {
        return fract(sin(dot(uv.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }

`;

export const fragmentChunk2 = /* glsl */ `

    #include <opaque_fragment>



    // Main red effect
    vec3 redEffect = vec3(1.0, 1.0, 1.0);

    // noise
    vec2 uv = gl_FragCoord.xy / u_Resolution;
    float noise = perlinNoise(uv * 50.0 + u_Time * 0.01);

    // distance from mouse
    float d = distance(v_Uv, u_Mouse);

    float visibility = 1. - smoothstep(0.1, 0.3, d);

    // Fresnel calculation
    float cosTheta = abs(dot(normalize(v_ViewDirection), normalize(v_Normal)));
    float fresnel = fresnelSchlick(cosTheta, 0.04);
    fresnel *= u_Intensity;

    // Mix Fresnel edge blue color
    vec3 frostedColor = mix(redEffect * outgoingLight * (.9 + 0.1 * noise), u_Color * outgoingLight , fresnel) ;

    float alpha = 1.0;
  // Alpha logic


    gl_FragColor = vec4( frostedColor , diffuseColor.a  );
    // Output final color


`;
