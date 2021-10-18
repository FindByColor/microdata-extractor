![Find By Color Logo](img/logo.png "Find By Color Logo Logo")

**[↤ Developer Overview](../README.md)**

Usage Instructions
===

> After installation, you can run the following in terminal:

```bash
extract https://mywebsite.com --options
```

CLI Options
---

Name            | CLI Param & Alias   | Default   | Definition
----------------|---------------------|-----------|---------------------------------------
Cache           | `--cache`, `-c`     | `3600000` | Cache Expire for HTTP Requests
JSON+LD         | `--jsonld`, `-j`    | `false`   | Extract JSON+LD
META Tags       | `--metatags`, `-m`  | `false`   | Extract META Tags
Microdata       | `--microdata`, `-d` | `false`   | Extract Microdata
Output          | `--output`, `-o`    | `null`    | Save Output to File Path
Product Data    | `--product`, `-p`   | `false`   | Extract Product Data
RDFa            | `--rdfa`, `-r`      | `false`   | Extract RDFa
Request Timeout | `--timeout`, `-t`   | `30000`   | HTTP Request Timeout in Milliseconds

Examples using CLI Params
---

Test a Website and Output Report to Terminal Window:

```bash
extract https://mywebsite.com
```

#### Extract All Data

```bash
extract https://website.com
```

#### Extract Only JSON+LD

```bash
extract https://website.com --jsonld
```

#### Extract Only Meta Tags

```bash
extract https://website.com --metatags
```

#### Extract Only Micro Data

```bash
extract https://website.com --microdata
```

#### Extract Only Product Data

```bash
extract https://website.com --product
```

#### Extract Only RDFa Data

```bash
extract https://website.com --rdfa
```

#### Disable Cached Requests

```bash
extract https://website.com --cache 0
```

#### Set Request Timeout to 30 Seconds

```bash
extract https://website.com --timeout 30000
```

#### Save Output to JSON File

```bash
extract https://website.com --output ~/file.json
```
