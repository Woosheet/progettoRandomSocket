import json
import ssl
import urllib.request as r
import eventlet
import socketio
from google.transit import gtfs_realtime_pb2
import sys

sio = socketio.Server(cors_allowed_origins="*", async_mode='eventlet')
app = socketio.WSGIApp(sio, static_files={"/":"client/"})

def job():
    while True:
        feed = gtfs_realtime_pb2.FeedMessage()
        context = ssl._create_unverified_context()
        try:
            response = r.urlopen(
                'https://romamobilita.it/sites/default/files/rome_rtgtfs_vehicle_positions_feed.pb', context=context)
            feed.ParseFromString(response.read())
            entity = feed.entity
            objAtac = []

            for entity in feed.entity:
                objAtac.append({
                    "route_id": entity.vehicle.trip.route_id,
                    "position": {
                    "latitude": entity.vehicle.position.latitude,
                    "longitude": entity.vehicle.position.longitude,
                    },
                    "current_stop": entity.vehicle.current_stop_sequence
                })

            json_object = json.dumps(objAtac, indent=4)
            jsonObj = json.loads(json_object)
            sio.emit("message", jsonObj, broadcast=True)
            sio.sleep(10)
        except:
            print("Ops!", sys.exc_info()[0], "occurred.")


@sio.event
def connect(sid, environ):
    print('connect ', sid)

@sio.event
def my_message(sid, data):
    print('message ', data)

@sio.event
def disconnect(sid):
    print('disconnect ', sid)
    
thread = sio.start_background_task(job)

if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('localhost', 5050)), app)
