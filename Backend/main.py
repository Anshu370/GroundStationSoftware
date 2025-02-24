from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import serial
import time
import json
import random
import threading

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Global variables (not needed for testing)
# serial_conn = None
# is_connected = False

# Global flag to control data streaming
is_streaming = False
stream_lock = threading.Lock()

# #  Establish Serial Connection
# @app.route("/connect", methods=["POST"])
# def connect_serial():
#     global serial_conn, is_connected
#     data = request.json
#     baudrate = data.get("baudrate")
#     com_port = data.get("com_port")

#     if not baudrate or not com_port:
#         return jsonify({"error": "Missing baudrate or COM port"}), 400

#     try:
#         # Close existing connection if any
#         if serial_conn and serial_conn.is_open:
#             serial_conn.close()
#             is_connected = False

#         # Try to open the serial port
#         serial_conn = serial.Serial(
#             port=com_port,
#             baudrate=baudrate,
#             timeout=1,
#             write_timeout=1
#         )
        
#         if serial_conn.is_open:
#             is_connected = True
#             return jsonify({
#                 "message": f"Connected to {com_port} at {baudrate} baud",
#                 "connected": True
#             }), 200
#         else:
#             is_connected = False
#             return jsonify({
#                 "message": "Serial not connected", 
#                 "error": "Failed to open port",
#                 "connected": False
#             }), 500
            
#     except serial.SerialException as e:
#         is_connected = False
#         return jsonify({
#             "message": "Serial not connected",
#             "error": f"Serial Exception: {str(e)}",
#             "connected": False
#         }), 500
#     except Exception as e:
#         is_connected = False
#         return jsonify({
#             "message": "Serial not connected",
#             "error": f"Unexpected error: {str(e)}",
#             "connected": False
#         }), 500



# Add disconnect endpoint
@app.route("/disconnect", methods=["POST"])
def disconnect():
    global is_streaming
    with stream_lock:
        is_streaming = False
    return jsonify({
        "message": "Disconnected successfully",
        "connected": False
    }), 200

# Update connect endpoint
@app.route("/connect", methods=["POST"])
def connect_serial():
    global is_streaming
    data = request.json
    baudrate = data.get("baudrate")
    com_port = data.get("com_port")

    with stream_lock:
        is_streaming = True

    return jsonify({
        "message": f"Connected to {com_port} at {baudrate} baud",
        "connected": True
    }), 200



#  API for Live Telemetry Data (Simulated for Now)
@app.route("/telemetry", methods=["GET"])
def telemetry():
    def generate_telemetry():
        global is_streaming
        while True:
            with stream_lock:
                if not is_streaming:
                    break
            
            time.sleep(1)
            data = {
                "altitude": random.uniform(100, 500),
                "humidity": random.uniform(10, 90),
                "pressure": random.uniform(950, 1050),
                "voltage": random.uniform(3.0, 12.0),
                "temperature": random.uniform(-10, 50),
                "velocity": random.uniform(0, 500),
                "gnss": {
                    "time": time.strftime("%H:%M:%S"),
                    "latitude": random.uniform(-90, 90),
                    "longitude": random.uniform(-180, 180)
                },
                "sensor_metrics": {
                    "gyro": [random.uniform(-5, 5) for _ in range(3)],
                    "acceleration": [random.uniform(-5, 5) for _ in range(3)],
                    "magnetic_field": [random.uniform(-50, 50) for _ in range(3)],
                    "velocity_xyz": [random.uniform(0, 500) for _ in range(3)]
                },
                "logs": "Telemetry data received successfully."
            }
            yield f"data: {json.dumps(data)}\n\n"

    return Response(generate_telemetry(), mimetype="text/event-stream")


#  API for Live Maps Data (Simulated for Now)
@app.route("/maps", methods=["GET"])
def maps():
    def generate_maps():
        global is_streaming
        while True:
            with stream_lock:
                if not is_streaming:
                    break
                
            time.sleep(1)
            data = {
                "time": time.strftime("%H:%M:%S"),
                "latitude": random.uniform(-90, 90),
                "longitude": random.uniform(-180, 180)
            }
            yield f"data: {json.dumps(data)}\n\n"

    return Response(generate_maps(), mimetype="text/event-stream")


#  API for Live Graph Data (Simulated for Now)
@app.route("/graphs", methods=["GET"])
def graphs():
    def generate_graphs():
        global is_streaming
        start_time = time.time()
        while True:
            with stream_lock:
                if not is_streaming:
                    break
                
            time.sleep(1)
            elapsed_time = round(time.time() - start_time, 2)
            data = {
                "time_since_launch": elapsed_time,
                "altitude": random.uniform(100, 500),
                "temperature": random.uniform(-10, 50),
                "pressure": random.uniform(950, 1050),
                "velocity": random.uniform(0, 500)
            }
            yield f"data: {json.dumps(data)}\n\n"

    return Response(generate_graphs(), mimetype="text/event-stream")


if __name__ == "__main__":
    app.run(debug=True, port=5000)