# osw

Make an off-site work request without suffering the pain of dealing with MenaME's UI

## Install

```sh
$ npm install -g osw
```

## Usage

```
$ osw [--version] [--clear] [--reason NOTES] [--start TIME] [--end TIME]

Available options:
  --help                   Show this help text
  --version                Print version of the program
  --clear                  Clear stored credentials
  --reason NOTES           Add notes, default: "Rotation"
  --start TIME             Add start time, default: "08:30" ("09:00"
                           in Ramadan)
  --end TIME               Add end time, default "05:00" ("05:30"
                           in DST, "03:30" in Ramadan)
```
