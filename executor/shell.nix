with import <nixpkgs> {};
mkShell {
  buildInputs = [
    python3Minimal
    jdk19_headless
  ];

  shellHook = ''
    cp result/bin/executor executor
    ./executor
  '';

}
