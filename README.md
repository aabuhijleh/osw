# osw

Make an off-site work request without suffering the pain of dealing with MenaME's UI

## Install

```sh
$ npm install -g osw
```

## Usage

```
$ osw [--clear] [--reason NOTES] [--start TIME] [--end TIME]

Available options:
  --clear                  Clear stored credentials
  --reason NOTES           Add custom notes, default: "Rotation"
  --start TIME             Add custom start time, default: "08:30" ("09:00"
                           in Ramadan)
  --end TIME               Add custom end time, default "05:00" ("05:30"
                           in DST, "03:30" in Ramadan)
```
