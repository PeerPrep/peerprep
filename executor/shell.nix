with import <nixpkgs> {};
mkShell {
  buildInputs = [
    python3Minimal
    jdk19_headless
  ];

  shellHook = ''
    cd result/bin
    ./executor
  '';

}
