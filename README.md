# setup-aapt2

A GitHub Action that downloads **AAPT2** from Google Maven and adds it to `PATH`.

## Usage

**Basic**:

```yaml
- name: Set up AAPT2
  uses: OussamaTeyib/setup-aapt2@v1
```

**With a pinned version**:

```yaml
- name: Set up AAPT2
  uses: OussamaTeyib/setup-aapt2@v1
  with:
    version: '9.2.1-15009934'
```

## Development

```bash
npm install
npm run build
```

Always commit the `dist/` folder — GitHub Actions runs the compiled bundle directly.

## License

This project is licensed under the [MIT License](LICENSE).