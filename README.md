# setup-aapt2

A GitHub Action that downloads **Android Asset Packaging Tool 2 (AAPT2)** from [Google Maven](https://maven.google.com/web/index.html#com.android.tools.build:aapt2) and adds it to `PATH`.

> [!NOTE]
> Unlike the AAPT2 in the Android build tools package, the version from Google Maven (used by this action) is [bundletool-compatible](https://developer.android.com/build/building-cmdline#bundletool-build).

---

## Usage

**Basic** (automatically uses the latest stable version):

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

---

## Development

```bash
# Install dependencies
npm install

# Build the project (TypeScript type checking)
npm run build

# Package the project (bundle with ncc)
npm run package

# Build and package in one command
npm run all
```

Always commit the `dist/` folder — GitHub Actions runs the compiled bundle directly.

---

## License

This project is licensed under the [MIT License](LICENSE).
