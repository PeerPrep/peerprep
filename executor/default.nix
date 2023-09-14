with import <nixpkgs> {};
gcc13Stdenv.mkDerivation {
  name = "executor";
  nativeBuildInputs = [ cmake ];
  buildInputs = [ python3Minimal jdk19_headless ];
  src = builtins.path { path = ./.; name = "executor"; };

  dontUseCmakeConfigure = true;

  buildPhase = ''
    cmake -DCMAKE_BUILD_TYPE=Release -S . -B ./build
    cmake --build ./build --config Release
  '';

  installPhase = ''
    mkdir -p $out/bin
    cp ./build/executor $out/bin/executor
  '';
}
