BASE_IMAGE_URLS = "static/media/gestalt_masks_multiscene/scene_*"
LOCAL_IMAGES = False
S3_BUCKET = "gestalt-scenes"
TEXTURE_SPLITS = [f"test_{tex}" for tex in ("voronoi", "noise", "wave")]
OBJS_PER_SCENE = [f"superquadric_{i}" for i in range(1, 5)]
SCENES_PER_TEXTURE = 5
FRAMES_PER_SCENE = 64
TRIALS_PER_BATCH = 120
PREPROCESSED = True
S3_ROOT = "https://tdw-scenes.s3.us-east-2.amazonaws.com"
DB_NAME = "psychophys"
ALLOWED_IDS = ["yoni"]
DEBUG = False

random_seed = 42