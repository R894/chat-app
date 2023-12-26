package utils

// RemoveStringFromArray removes a certain string from an array
func RemoveStringFromArray(arr []string, target string) []string {
	var result []string
	for _, value := range arr {
		if value != target {
			result = append(result, value)
		}
	}
	return result
}
