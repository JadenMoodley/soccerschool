import { supabase } from './supabase'

// Upload image to Supabase Storage
export const uploadImage = async (file, folder = 'students') => {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // Upload file
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

// Delete image from Supabase Storage
export const deleteImage = async (url) => {
  try {
    // Extract file path from URL
    const urlParts = url.split('/')
    const filePath = urlParts.slice(-2).join('/') // Get folder/filename
    
    const { error } = await supabase.storage
      .from('images')
      .remove([filePath])

    if (error) throw error
  } catch (error) {
    console.error('Error deleting image:', error)
    // Don't throw - image might not exist or already deleted
  }
}

