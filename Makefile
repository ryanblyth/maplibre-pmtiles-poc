.PHONY: icons sprite

icons:
	./tools/fetch-icons.sh

sprite: icons
	./tools/make-sprites.sh
