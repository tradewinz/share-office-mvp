class MigrateToCloudinary < ActiveRecord::Migration
  def up
 	s3 = AWS::S3.new(:access_key_id => 'AKIAJWKNWRO6ZAWT74HA', 
 					 :secret_access_key => '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')

 	s3.buckets.each do |bucket| 
 		puts "bucket = " + bucket.name
 		bucket.objects.each(:limit => 20) do |image|
 			url = "https://" + bucket.name + ".s3.amazonaws.com/" + image.key 
 			puts image.key + " path = " + url
 			Cloudinary::Uploader.upload(url)
 		end
 	end
end


  def down
  end
end
