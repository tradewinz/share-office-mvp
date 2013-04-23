CarrierWave.configure do |config|
  config.fog_credentials = {
    :provider               => 'AWS',                                         # required
    :aws_access_key_id      => 'AKIAJWKNWRO6ZAWT74HA',                        # required
    :aws_secret_access_key  => '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',    # required
  } 
  config.fog_directory  = 'tradewinz-demo'                     # required
end