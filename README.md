# node-plantlink-dweet
Reads from Plantlink's unofficial API and Dweets when things change

# usage
Create a file named `.env` in the project directory with the contents:

```
PLANTLINK_AUTH=YOUR_AUTH_KEY
DWEETIO_THINGNAME=your-thing-name
```
(get the auth key from Plantlink by inspecting the request and grabbing it from the cookie)

### Dweet once
```bash
$ node index
```

### Loop and Dweet every time there is a change
```bash
$ node index -r 60
```
