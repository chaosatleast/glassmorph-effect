export const vertexChunk1 = /* glsl */ `
    varying vec3 v_ViewDirection;
    varying vec3 v_Normal;
    varying vec2 v_Uv;
`;

export const vertexChunk2 = /* glsl */ `
    #include <project_vertex>
    v_Uv = uv;
    v_Normal = normalize(normalMatrix * normal);
    v_ViewDirection = normalize(cameraPosition - mvPosition.xyz);
`;
