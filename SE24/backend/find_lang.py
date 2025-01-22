from difflib import get_close_matches

languages = []


def init_find_lang():
    global languages
    languages = set(
        ["markup", "html", "xml", "svg", "mathml", "ssml", "atom", "rss",
         "css", "like", "javascript", "js", "abap", "abnf", "actionscript",
         "ada", "agda", "al", "antlr4", "g4", "apacheconf", "apex", "apl",
         "applescript", "aql", "arduino", "ino", "arff", "armasm", "arm",
         "arturo", "art", "asciidoc", "adoc", "aspnet", "asm6502", "asmatmel",
         "autohotkey", "autoit", "avisynth", "avs", "avro", "awk", "gawk",
         "bash", "sh", "shell", "basic", "batch", "bbcode", "shortcode", "bbj",
         "bicep", "birb", "bison", "bnf", "rbnf", "bqn", "brainfuck",
         "brightscript", "bro", "bsl", "oscript", "c", "csharp", "cs",
         "dotnet", "cpp", "cfscript", "cfc", "chaiscript", "cil", "cilkc",
         "cilk", "cilkcpp", "cilk", "clojure", "cmake", "cobol",
         "coffeescript", "coffee", "concurnas", "conc", "security", "cooklang",
         "coq", "crystal", "css", "csv", "cue", "cypher", "d", "dart",
         "dataweave", "dax", "dhall", "diff", "django", "jinja2", "dns",
         "docker", "dockerfile", "dot", "gv", "ebnf", "editorconfig", "eiffel",
         "ejs", "eta", "elixir", "elm", "etlua", "erb", "erlang", "excel",
         "fsharp", "factor", "false", "firestore", "flow", "fortran", "ftl",
         "gml", "gamemakerlanguage", "gap", "code", "gdscript", "gedcom",
         "gettext", "po", "gherkin", "git", "glsl", "gn", "gni", "linker",
         "go", "go", "gradle", "graphql", "groovy", "haml", "handlebars",
         "hbs", "mustache", "haskell", "hs", "haxe", "hcl", "hlsl", "hoon",
         "http", "key", "transport", "ichigojam", "icon", "icu", "idris",
         "idr", "ignore", "gitignore", "hgignore", "npmignore", "inform7",
         "ini", "io", "j", "java", "javadoc", "like", "javastacktrace", "jexl",
         "jolie", "jq", "jsdoc", "js", "json", "webmanifest", "json5", "jsonp",
         "jsstacktrace", "js", "julia", "keepalived", "keyman", "kotlin", "kt",
         "kts", "kumir", "kum", "kusto", "latex", "tex", "context", "latte",
         "less", "lilypond", "ly", "liquid", "lisp", "emacs", "elisp", "emacs",
         "livescript", "llvm", "log", "lolcode", "lua", "magma", "makefile",
         "markdown", "md", "markup", "mata", "matlab", "maxscript", "mel",
         "mermaid", "metafont", "mizar", "mongodb", "monkey", "moonscript",
         "moon", "n1ql", "n4js", "n4jsd", "nand2tetris", "naniscript", "nani",
         "nasm", "neon", "nevod", "nginx", "nim", "nix", "nsis", "c", "ocaml",
         "odin", "opencl", "openqasm", "qasm", "oz", "parigp", "parser",
         "pascal", "objectpascal", "pascaligo", "psl", "axis", "peoplecode",
         "pcode", "perl", "php", "phpdoc", "php", "plant", "plsql",
         "powerquery", "pq", "mscript", "powershell", "processing", "prolog",
         "promql", "properties", "protobuf", "pug", "puppet", "pure",
         "purebasic", "pbfasm", "purescript", "purs", "python", "py", "qsharp",
         "qs", "q", "qml", "qore", "r", "racket", "rkt", "cshtml", "razor",
         "jsx", "tsx", "reason", "regex", "rego", "renpy", "rpy", "rescript",
         "res", "rest", "rip", "roboconf", "robotframework", "robot", "ruby",
         "rb", "rust", "sas", "sass", "scss", "scala", "scheme", "shell",
         "smali", "smalltalk", "smarty", "sml", "smlnj", "solidity", "sol",
         "solution", "soy", "sparql", "rq", "splunk", "sqf", "sql", "squirrel",
         "stan", "stata", "3)", "stylus", "supercollider", "sclang", "swift",
         "systemd", "t4", "t4", "t4", "tap", "tcl", "tt2", "textile", "toml",
         "tremor", "trickle", "troy", "turtle", "trig", "twig", "typescript",
         "ts", "typoscript", "tsconfig", "unrealscript", "uscript", "uc",
         "uorazor", "uri", "url", "v", "vala", "vbnet", "velocity", "verilog",
         "vhdl", "vim", "visual", "warpscript", "wasm", "web", "wgsl", "wiki",
         "wolfram", "mathematica", "nb", "wl", "wren", "xeora", "xeoracube",
         "xml", "xojo", "xquery", "yaml", "yml", "yang", "zig"])


def find_match(text):
    text = text.replace("#", "sharp").replace("+", "p").replace(" ", "")\
        .lower()
    if text in languages:
        return text
    else:
        match = get_close_matches(text, languages, 1)
        return match[0] if match else "javascript"
